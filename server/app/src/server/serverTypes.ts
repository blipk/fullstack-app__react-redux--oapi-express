/**
 * This file contains typings and generators related to server level data
 * @module
 */
import type { IncomingHttpHeaders } from "http"
import type { ParsedQs } from "qs"

/**
 * Represents an express Request
 */
interface JsonifiedRequest {
    method: string;
    url: string;
    headers: IncomingHttpHeaders;
    query: ParsedQs;
    body: unknown;
    params: Record<string, string | undefined>;
    cookies: unknown;
    ip: string | undefined;
    protocol: string;
    originalUrl: string;
    hostname: string;
    path: string;
    secure: boolean;
    xhr: boolean;
}

export type { JsonifiedRequest }