import { CHAR_DOT, CHAR_FORWARD_SLASH } from "./_constants.ts";
import { _format, assertPath, isPosixPathSeparator, normalizeString, } from "./_util.ts";
export const sep = "/";
export const delimiter = ":";
export function resolve(...pathSegments) {
    let resolvedPath = "";
    let resolvedAbsolute = false;
    for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        let path;
        if (i >= 0)
            path = pathSegments[i];
        else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path = Deno.cwd();
        }
        assertPath(path);
        if (path.length === 0) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
    if (resolvedAbsolute) {
        if (resolvedPath.length > 0)
            return `/${resolvedPath}`;
        else
            return "/";
    }
    else if (resolvedPath.length > 0)
        return resolvedPath;
    else
        return ".";
}
export function normalize(path) {
    assertPath(path);
    if (path.length === 0)
        return ".";
    const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
    path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
    if (path.length === 0 && !isAbsolute)
        path = ".";
    if (path.length > 0 && trailingSeparator)
        path += "/";
    if (isAbsolute)
        return `/${path}`;
    return path;
}
export function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
}
export function join(...paths) {
    if (paths.length === 0)
        return ".";
    let joined;
    for (let i = 0, len = paths.length; i < len; ++i) {
        const path = paths[i];
        assertPath(path);
        if (path.length > 0) {
            if (!joined)
                joined = path;
            else
                joined += `/${path}`;
        }
    }
    if (!joined)
        return ".";
    return normalize(joined);
}
export function relative(from, to) {
    assertPath(from);
    assertPath(to);
    if (from === to)
        return "";
    from = resolve(from);
    to = resolve(to);
    if (from === to)
        return "";
    let fromStart = 1;
    const fromEnd = from.length;
    for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH)
            break;
    }
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    const toEnd = to.length;
    for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH)
            break;
    }
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i <= length; ++i) {
        if (i === length) {
            if (toLen > length) {
                if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
                    return to.slice(toStart + i + 1);
                }
                else if (i === 0) {
                    return to.slice(toStart + i);
                }
            }
            else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === CHAR_FORWARD_SLASH) {
                    lastCommonSep = i;
                }
                else if (i === 0) {
                    lastCommonSep = 0;
                }
            }
            break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode)
            break;
        else if (fromCode === CHAR_FORWARD_SLASH)
            lastCommonSep = i;
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (i === fromEnd || from.charCodeAt(i) === CHAR_FORWARD_SLASH) {
            if (out.length === 0)
                out += "..";
            else
                out += "/..";
        }
    }
    if (out.length > 0)
        return out + to.slice(toStart + lastCommonSep);
    else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH)
            ++toStart;
        return to.slice(toStart);
    }
}
export function toNamespacedPath(path) {
    return path;
}
export function dirname(path) {
    assertPath(path);
    if (path.length === 0)
        return ".";
    const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
            if (!matchedSlash) {
                end = i;
                break;
            }
        }
        else {
            matchedSlash = false;
        }
    }
    if (end === -1)
        return hasRoot ? "/" : ".";
    if (hasRoot && end === 1)
        return "//";
    return path.slice(0, end);
}
export function basename(path, ext = "") {
    if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
    }
    assertPath(path);
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path)
            return "";
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
            const code = path.charCodeAt(i);
            if (code === CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            }
            else {
                if (firstNonSlashEnd === -1) {
                    matchedSlash = false;
                    firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                    if (code === ext.charCodeAt(extIdx)) {
                        if (--extIdx === -1) {
                            end = i;
                        }
                    }
                    else {
                        extIdx = -1;
                        end = firstNonSlashEnd;
                    }
                }
            }
        }
        if (start === end)
            end = firstNonSlashEnd;
        else if (end === -1)
            end = path.length;
        return path.slice(start, end);
    }
    else {
        for (i = path.length - 1; i >= 0; --i) {
            if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    start = i + 1;
                    break;
                }
            }
            else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (end === -1)
            return "";
        return path.slice(start, end);
    }
}
export function extname(path) {
    assertPath(path);
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === CHAR_DOT) {
            if (startDot === -1)
                startDot = i;
            else if (preDotState !== 1)
                preDotState = 1;
        }
        else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 ||
        end === -1 ||
        preDotState === 0 ||
        (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
        return "";
    }
    return path.slice(startDot, end);
}
export function format(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
    }
    return _format("/", pathObject);
}
export function parse(path) {
    assertPath(path);
    const ret = { root: "", dir: "", base: "", ext: "", name: "" };
    if (path.length === 0)
        return ret;
    const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    let start;
    if (isAbsolute) {
        ret.root = "/";
        start = 1;
    }
    else {
        start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === CHAR_FORWARD_SLASH) {
            if (!matchedSlash) {
                startPart = i + 1;
                break;
            }
            continue;
        }
        if (end === -1) {
            matchedSlash = false;
            end = i + 1;
        }
        if (code === CHAR_DOT) {
            if (startDot === -1)
                startDot = i;
            else if (preDotState !== 1)
                preDotState = 1;
        }
        else if (startDot !== -1) {
            preDotState = -1;
        }
    }
    if (startDot === -1 ||
        end === -1 ||
        preDotState === 0 ||
        (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
        if (end !== -1) {
            if (startPart === 0 && isAbsolute) {
                ret.base = ret.name = path.slice(1, end);
            }
            else {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
    }
    else {
        if (startPart === 0 && isAbsolute) {
            ret.name = path.slice(1, startDot);
            ret.base = path.slice(1, end);
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0)
        ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute)
        ret.dir = "/";
    return ret;
}
export function fromFileUrl(url) {
    url = url instanceof URL ? url : new URL(url);
    if (url.protocol != "file:") {
        throw new TypeError("Must be a file URL.");
    }
    return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
}
export function toFileUrl(path) {
    if (!isAbsolute(path)) {
        throw new TypeError("Must be an absolute path.");
    }
    const url = new URL("file:///");
    url.pathname = path.replace(/%/g, "%25").replace(/\\/g, "%5C");
    return url;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb3NpeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxPQUFPLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0QsT0FBTyxFQUNMLE9BQU8sRUFDUCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLGVBQWUsR0FDaEIsTUFBTSxZQUFZLENBQUM7QUFFcEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUN2QixNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBSTdCLE1BQU0sVUFBVSxPQUFPLENBQUMsR0FBRyxZQUFzQjtJQUMvQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7SUFDdEIsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7SUFFN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2RSxJQUFJLElBQVksQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtZQUNILElBQUksVUFBVSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7Z0JBQzNCLE1BQU0sSUFBSSxTQUFTLENBQUMseUNBQXlDLENBQUMsQ0FBQzthQUNoRTtZQUNELElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDbkI7UUFFRCxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFHakIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNyQixTQUFTO1NBQ1Y7UUFFRCxZQUFZLEdBQUcsR0FBRyxJQUFJLElBQUksWUFBWSxFQUFFLENBQUM7UUFDekMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxrQkFBa0IsQ0FBQztLQUM5RDtJQU1ELFlBQVksR0FBRyxlQUFlLENBQzVCLFlBQVksRUFDWixDQUFDLGdCQUFnQixFQUNqQixHQUFHLEVBQ0gsb0JBQW9CLENBQ3JCLENBQUM7SUFFRixJQUFJLGdCQUFnQixFQUFFO1FBQ3BCLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDO1lBQUUsT0FBTyxJQUFJLFlBQVksRUFBRSxDQUFDOztZQUNsRCxPQUFPLEdBQUcsQ0FBQztLQUNqQjtTQUFNLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQUUsT0FBTyxZQUFZLENBQUM7O1FBQ25ELE9BQU8sR0FBRyxDQUFDO0FBQ2xCLENBQUM7QUFHRCxNQUFNLFVBQVUsU0FBUyxDQUFDLElBQVk7SUFDcEMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWpCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQUUsT0FBTyxHQUFHLENBQUM7SUFFbEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxrQkFBa0IsQ0FBQztJQUM3RCxNQUFNLGlCQUFpQixHQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssa0JBQWtCLENBQUM7SUFHMUQsSUFBSSxHQUFHLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixDQUFDLENBQUM7SUFFckUsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVU7UUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2pELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksaUJBQWlCO1FBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQztJQUV0RCxJQUFJLFVBQVU7UUFBRSxPQUFPLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbEMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsTUFBTSxVQUFVLFVBQVUsQ0FBQyxJQUFZO0lBQ3JDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixPQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssa0JBQWtCLENBQUM7QUFDdEUsQ0FBQztBQUdELE1BQU0sVUFBVSxJQUFJLENBQUMsR0FBRyxLQUFlO0lBQ3JDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQUUsT0FBTyxHQUFHLENBQUM7SUFDbkMsSUFBSSxNQUEwQixDQUFDO0lBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDaEQsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxNQUFNO2dCQUFFLE1BQU0sR0FBRyxJQUFJLENBQUM7O2dCQUN0QixNQUFNLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztTQUMzQjtLQUNGO0lBQ0QsSUFBSSxDQUFDLE1BQU07UUFBRSxPQUFPLEdBQUcsQ0FBQztJQUN4QixPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQixDQUFDO0FBR0QsTUFBTSxVQUFVLFFBQVEsQ0FBQyxJQUFZLEVBQUUsRUFBVTtJQUMvQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRWYsSUFBSSxJQUFJLEtBQUssRUFBRTtRQUFFLE9BQU8sRUFBRSxDQUFDO0lBRTNCLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVqQixJQUFJLElBQUksS0FBSyxFQUFFO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFHM0IsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDNUIsT0FBTyxTQUFTLEdBQUcsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFO1FBQ3ZDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxrQkFBa0I7WUFBRSxNQUFNO0tBQzlEO0lBQ0QsTUFBTSxPQUFPLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztJQUdwQyxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUN4QixPQUFPLE9BQU8sR0FBRyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUU7UUFDakMsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLGtCQUFrQjtZQUFFLE1BQU07S0FDMUQ7SUFDRCxNQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsT0FBTyxDQUFDO0lBRzlCLE1BQU0sTUFBTSxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2pELElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLE9BQU8sQ0FBQyxJQUFJLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN2QixJQUFJLENBQUMsS0FBSyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxFQUFFO2dCQUNsQixJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxLQUFLLGtCQUFrQixFQUFFO29CQUdyRCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbEM7cUJBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUdsQixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUM5QjthQUNGO2lCQUFNLElBQUksT0FBTyxHQUFHLE1BQU0sRUFBRTtnQkFDM0IsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxrQkFBa0IsRUFBRTtvQkFHekQsYUFBYSxHQUFHLENBQUMsQ0FBQztpQkFDbkI7cUJBQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUdsQixhQUFhLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQjthQUNGO1lBQ0QsTUFBTTtTQUNQO1FBQ0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDaEQsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxRQUFRLEtBQUssTUFBTTtZQUFFLE1BQU07YUFDMUIsSUFBSSxRQUFRLEtBQUssa0JBQWtCO1lBQUUsYUFBYSxHQUFHLENBQUMsQ0FBQztLQUM3RDtJQUVELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUdiLEtBQUssQ0FBQyxHQUFHLFNBQVMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDekQsSUFBSSxDQUFDLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssa0JBQWtCLEVBQUU7WUFDOUQsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUM7Z0JBQUUsR0FBRyxJQUFJLElBQUksQ0FBQzs7Z0JBQzdCLEdBQUcsSUFBSSxLQUFLLENBQUM7U0FDbkI7S0FDRjtJQUlELElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQUUsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLENBQUM7U0FDOUQ7UUFDSCxPQUFPLElBQUksYUFBYSxDQUFDO1FBQ3pCLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxrQkFBa0I7WUFBRSxFQUFFLE9BQU8sQ0FBQztRQUM3RCxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUI7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLElBQVk7SUFFM0MsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBR0QsTUFBTSxVQUFVLE9BQU8sQ0FBQyxJQUFZO0lBQ2xDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUFFLE9BQU8sR0FBRyxDQUFDO0lBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssa0JBQWtCLENBQUM7SUFDMUQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDYixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3pDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxrQkFBa0IsRUFBRTtZQUM3QyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNqQixHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNSLE1BQU07YUFDUDtTQUNGO2FBQU07WUFFTCxZQUFZLEdBQUcsS0FBSyxDQUFDO1NBQ3RCO0tBQ0Y7SUFFRCxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFBRSxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDM0MsSUFBSSxPQUFPLElBQUksR0FBRyxLQUFLLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUN0QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFHRCxNQUFNLFVBQVUsUUFBUSxDQUFDLElBQVksRUFBRSxHQUFHLEdBQUcsRUFBRTtJQUM3QyxJQUFJLEdBQUcsS0FBSyxTQUFTLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1FBQ2hELE1BQU0sSUFBSSxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztLQUN4RDtJQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVqQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNiLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztJQUN4QixJQUFJLENBQVMsQ0FBQztJQUVkLElBQUksR0FBRyxLQUFLLFNBQVMsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDcEUsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxLQUFLLElBQUk7WUFBRSxPQUFPLEVBQUUsQ0FBQztRQUMxRCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzFCLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDckMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLElBQUksS0FBSyxrQkFBa0IsRUFBRTtnQkFHL0IsSUFBSSxDQUFDLFlBQVksRUFBRTtvQkFDakIsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2QsTUFBTTtpQkFDUDthQUNGO2lCQUFNO2dCQUNMLElBQUksZ0JBQWdCLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBRzNCLFlBQVksR0FBRyxLQUFLLENBQUM7b0JBQ3JCLGdCQUFnQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzFCO2dCQUNELElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFFZixJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO3dCQUNuQyxJQUFJLEVBQUUsTUFBTSxLQUFLLENBQUMsQ0FBQyxFQUFFOzRCQUduQixHQUFHLEdBQUcsQ0FBQyxDQUFDO3lCQUNUO3FCQUNGO3lCQUFNO3dCQUdMLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDWixHQUFHLEdBQUcsZ0JBQWdCLENBQUM7cUJBQ3hCO2lCQUNGO2FBQ0Y7U0FDRjtRQUVELElBQUksS0FBSyxLQUFLLEdBQUc7WUFBRSxHQUFHLEdBQUcsZ0JBQWdCLENBQUM7YUFDckMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUMvQjtTQUFNO1FBQ0wsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNyQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssa0JBQWtCLEVBQUU7Z0JBRzdDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ2pCLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNkLE1BQU07aUJBQ1A7YUFDRjtpQkFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFHckIsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDckIsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDYjtTQUNGO1FBRUQsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO1lBQUUsT0FBTyxFQUFFLENBQUM7UUFDMUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUMvQjtBQUNILENBQUM7QUFHRCxNQUFNLFVBQVUsT0FBTyxDQUFDLElBQVk7SUFDbEMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNsQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNiLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztJQUd4QixJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7SUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxJQUFJLEtBQUssa0JBQWtCLEVBQUU7WUFHL0IsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDakIsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU07YUFDUDtZQUNELFNBQVM7U0FDVjtRQUNELElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBR2QsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUNyQixHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNiO1FBQ0QsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO1lBRXJCLElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQztnQkFBRSxRQUFRLEdBQUcsQ0FBQyxDQUFDO2lCQUM3QixJQUFJLFdBQVcsS0FBSyxDQUFDO2dCQUFFLFdBQVcsR0FBRyxDQUFDLENBQUM7U0FDN0M7YUFBTSxJQUFJLFFBQVEsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUcxQixXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDbEI7S0FDRjtJQUVELElBQ0UsUUFBUSxLQUFLLENBQUMsQ0FBQztRQUNmLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFFVixXQUFXLEtBQUssQ0FBQztRQUVqQixDQUFDLFdBQVcsS0FBSyxDQUFDLElBQUksUUFBUSxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksUUFBUSxLQUFLLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFDekU7UUFDQSxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBR0QsTUFBTSxVQUFVLE1BQU0sQ0FBQyxVQUFpQztJQUN0RCxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQ3pELE1BQU0sSUFBSSxTQUFTLENBQ2pCLG1FQUFtRSxPQUFPLFVBQVUsRUFBRSxDQUN2RixDQUFDO0tBQ0g7SUFDRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUdELE1BQU0sVUFBVSxLQUFLLENBQUMsSUFBWTtJQUNoQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFakIsTUFBTSxHQUFHLEdBQWUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMzRSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUFFLE9BQU8sR0FBRyxDQUFDO0lBQ2xDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssa0JBQWtCLENBQUM7SUFDN0QsSUFBSSxLQUFhLENBQUM7SUFDbEIsSUFBSSxVQUFVLEVBQUU7UUFDZCxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNmLEtBQUssR0FBRyxDQUFDLENBQUM7S0FDWDtTQUFNO1FBQ0wsS0FBSyxHQUFHLENBQUMsQ0FBQztLQUNYO0lBQ0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbEIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2IsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBSXhCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztJQUdwQixPQUFPLENBQUMsSUFBSSxLQUFLLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDdEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLElBQUksS0FBSyxrQkFBa0IsRUFBRTtZQUcvQixJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNqQixTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEIsTUFBTTthQUNQO1lBQ0QsU0FBUztTQUNWO1FBQ0QsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFHZCxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2I7UUFDRCxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7WUFFckIsSUFBSSxRQUFRLEtBQUssQ0FBQyxDQUFDO2dCQUFFLFFBQVEsR0FBRyxDQUFDLENBQUM7aUJBQzdCLElBQUksV0FBVyxLQUFLLENBQUM7Z0JBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQztTQUM3QzthQUFNLElBQUksUUFBUSxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBRzFCLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNsQjtLQUNGO0lBRUQsSUFDRSxRQUFRLEtBQUssQ0FBQyxDQUFDO1FBQ2YsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUVWLFdBQVcsS0FBSyxDQUFDO1FBRWpCLENBQUMsV0FBVyxLQUFLLENBQUMsSUFBSSxRQUFRLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxRQUFRLEtBQUssU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUN6RTtRQUNBLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2QsSUFBSSxTQUFTLEtBQUssQ0FBQyxJQUFJLFVBQVUsRUFBRTtnQkFDakMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQzFDO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNsRDtTQUNGO0tBQ0Y7U0FBTTtRQUNMLElBQUksU0FBUyxLQUFLLENBQUMsSUFBSSxVQUFVLEVBQUU7WUFDakMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNuQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQy9CO2FBQU07WUFDTCxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDdkM7UUFDRCxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDO0lBRUQsSUFBSSxTQUFTLEdBQUcsQ0FBQztRQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3JELElBQUksVUFBVTtRQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBRW5DLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQU1ELE1BQU0sVUFBVSxXQUFXLENBQUMsR0FBaUI7SUFDM0MsR0FBRyxHQUFHLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUMsSUFBSSxHQUFHLENBQUMsUUFBUSxJQUFJLE9BQU8sRUFBRTtRQUMzQixNQUFNLElBQUksU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDNUM7SUFDRCxPQUFPLGtCQUFrQixDQUN2QixHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsQ0FDcEQsQ0FBQztBQUNKLENBQUM7QUFNRCxNQUFNLFVBQVUsU0FBUyxDQUFDLElBQVk7SUFDcEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNyQixNQUFNLElBQUksU0FBUyxDQUFDLDJCQUEyQixDQUFDLENBQUM7S0FDbEQ7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDIn0=