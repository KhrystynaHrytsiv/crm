const bearer = [{ bearerAuth: [] }];
const json = (schema: object) => ({ "application/json": { schema } });
const ok = (description: string, schema?: object) => ({
    description,
    ...(schema && { content: json(schema) }),
});
const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });
const errors = {
    400: { description: "Validation error", content: json(ref("Error")) },
    401: { description: "Unauthorized", content: json(ref("Error")) },
    403: { description: "Forbidden", content: json(ref("Error")) },
};
const pathParam = (
    name: string,
    description: string,
    schema: object = { type: "string" },
) => ({ name, in: "path", required: true, description, schema });
const queryParam = (
    name: string,
    description: string,
    schema: object = { type: "string" },
) => ({ name, in: "query", required: false, description, schema });

const orderFilters = [
    queryParam(
        "order",
        "Sort field, prefix '-' for DESC (e.g. id, -id, name, -created_at). Default: -id",
    ),
    queryParam("name", "Substring, case-insensitive"),
    queryParam("surname", "Substring, case-insensitive"),
    queryParam("email", "Substring, case-insensitive"),
    queryParam("phone", "Substring, case-insensitive"),
    queryParam("age", "Exact age", { type: "integer" }),
    queryParam("course", "Exact course", {
        type: "string",
        enum: ["FS", "QACX", "JCX", "JSCX", "FE", "PCX"],
    }),
    queryParam("course_format", "Exact format", {
        type: "string",
        enum: ["static", "online"],
    }),
    queryParam("course_type", "Exact type", {
        type: "string",
        enum: ["pro", "minimal", "premium", "incubator", "vip"],
    }),
    queryParam("status", "Exact status ('new' also matches empty status)", {
        type: "string",
        enum: ["in work", "new", "agree", "disagree", "dubbing"],
    }),
    queryParam("group", "Exact group"),
    queryParam("start_date", "Created from (YYYY-MM-DD)", {
        type: "string",
        format: "date",
    }),
    queryParam("end_date", "Created to (YYYY-MM-DD)", {
        type: "string",
        format: "date",
    }),
    queryParam("my", "'true' — only orders of the current user", {
        type: "string",
        enum: ["true"],
    }),
];

export const swaggerDocument = {
    openapi: "3.0.3",
    info: { title: "CRM Programming School API", version: "1.0.0" },
    servers: [{ url: "http://localhost:4000" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description:
                    "Access token (refresh token for /auth/refresh and /auth/logout)",
            },
        },
        schemas: {
            Error: {
                type: "object",
                properties: {
                    status: { type: "integer" },
                    message: { type: "string" },
                },
            },
            Tokens: {
                type: "object",
                properties: {
                    accessToken: { type: "string" },
                    refreshToken: { type: "string" },
                },
            },
            User: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    email: { type: "string" },
                    name: { type: "string" },
                    surname: { type: "string" },
                    role: { type: "string", enum: ["admin", "manager"] },
                    is_Active: { type: "boolean" },
                    last_login: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                    },
                },
            },
            Order: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    id: { type: "integer" },
                    name: { type: "string" },
                    surname: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    age: { type: "integer" },
                    course: { type: "string" },
                    course_format: { type: "string" },
                    course_type: { type: "string" },
                    status: { type: "string", nullable: true },
                    sum: { type: "number", nullable: true },
                    alreadyPaid: { type: "number", nullable: true },
                    created_at: { type: "string", format: "date-time" },
                    group: { type: "string", nullable: true },
                    msg: { type: "string", nullable: true },
                    utm: { type: "string", nullable: true },
                    manager: {
                        type: "object",
                        nullable: true,
                        properties: {
                            _id: { type: "string" },
                            surname: { type: "string" },
                        },
                    },
                },
            },
            OrderUpdate: {
                type: "object",
                description:
                    "All fields are optional and may be empty. Status 'new' releases the order (manager = null).",
                properties: {
                    name: { type: "string" },
                    surname: { type: "string" },
                    email: { type: "string" },
                    phone: { type: "string" },
                    age: { type: "integer", minimum: 16, maximum: 90 },
                    course: { type: "string" },
                    course_format: { type: "string" },
                    course_type: { type: "string" },
                    status: { type: "string" },
                    sum: { type: "number" },
                    alreadyPaid: { type: "number" },
                    group: { type: "string" },
                },
            },
            Comment: {
                type: "object",
                properties: {
                    _id: { type: "string" },
                    orderId: { type: "string" },
                    comment: { type: "string" },
                    manager: {
                        type: "object",
                        properties: {
                            _id: { type: "string" },
                            surname: { type: "string" },
                        },
                    },
                    created_At: { type: "string", format: "date-time" },
                },
            },
            Statistics: {
                type: "object",
                properties: {
                    total: { type: "integer" },
                    "in work": { type: "integer" },
                    new: { type: "integer" },
                    agree: { type: "integer" },
                    disagree: { type: "integer" },
                    dubbing: { type: "integer" },
                    null: { type: "integer" },
                },
            },
            Pagination: {
                type: "object",
                properties: {
                    totalItems: { type: "integer" },
                    totalPages: { type: "integer" },
                    prevPage: { type: "boolean" },
                    nextPage: { type: "boolean" },
                    data: { type: "array", items: {} },
                },
            },
        },
    },
    paths: {
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login",
                requestBody: {
                    required: true,
                    content: json({
                        type: "object",
                        properties: {
                            email: {
                                type: "string",
                                example: "admin@gmail.com",
                            },
                            password: { type: "string", example: "admin" },
                        },
                    }),
                },
                responses: {
                    200: ok("Logged in", {
                        type: "object",
                        properties: {
                            user: ref("User"),
                            tokens: ref("Tokens"),
                        },
                    }),
                    401: errors[401],
                    403: errors[403],
                },
            },
        },
        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Refresh token pair (send refresh token as Bearer)",
                security: bearer,
                responses: {
                    200: ok("New tokens", ref("Tokens")),
                    401: errors[401],
                },
            },
        },
        "/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Logout (send refresh token as Bearer)",
                security: bearer,
                responses: { 204: ok("Logged out"), 401: errors[401] },
            },
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Current user",
                security: bearer,
                responses: {
                    200: ok("Current user", ref("User")),
                    401: errors[401],
                },
            },
        },
        "/orders": {
            get: {
                tags: ["Orders"],
                summary: "Orders list, 25 per page",
                security: bearer,
                parameters: [
                    queryParam("page", "Page number, default 1", {
                        type: "integer",
                    }),
                    ...orderFilters,
                ],
                responses: {
                    200: ok("Page of orders", {
                        allOf: [
                            ref("Pagination"),
                            {
                                properties: {
                                    data: {
                                        type: "array",
                                        items: ref("Order"),
                                    },
                                },
                            },
                        ],
                    }),
                    401: errors[401],
                },
            },
        },
        "/orders/excel": {
            get: {
                tags: ["Orders"],
                summary: "Excel file with orders matching the filters",
                security: bearer,
                parameters: orderFilters,
                responses: {
                    200: {
                        description: "xlsx file",
                        content: {
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                {
                                    schema: {
                                        type: "string",
                                        format: "binary",
                                    },
                                },
                        },
                    },
                    401: errors[401],
                },
            },
        },
        "/orders/groups": {
            get: {
                tags: ["Orders"],
                summary: "All groups",
                security: bearer,
                responses: {
                    200: ok("Group names", {
                        type: "array",
                        items: { type: "string" },
                    }),
                    401: errors[401],
                },
            },
        },
        "/orders/statistics": {
            get: {
                tags: ["Orders"],
                summary: "Orders count by status",
                security: bearer,
                responses: {
                    200: ok("Statistics", ref("Statistics")),
                    401: errors[401],
                },
            },
        },
        "/orders/{orderId}": {
            put: {
                tags: ["Orders"],
                summary:
                    "Edit order (only free orders or orders of the current user)",
                security: bearer,
                parameters: [pathParam("orderId", "Order _id")],
                requestBody: {
                    required: true,
                    content: json(ref("OrderUpdate")),
                },
                responses: {
                    200: ok("Updated order", ref("Order")),
                    ...errors,
                    404: { description: "Order not found" },
                },
            },
        },
        "/orders/{orderId}/comments": {
            get: {
                tags: ["Comments"],
                summary: "Comments of the order",
                security: bearer,
                parameters: [pathParam("orderId", "Order _id")],
                responses: {
                    200: ok("Comments", {
                        type: "array",
                        items: ref("Comment"),
                    }),
                    401: errors[401],
                },
            },
            post: {
                tags: ["Comments"],
                summary:
                    "Add comment. Assigns the order to the current user; status null/new becomes 'in work'",
                security: bearer,
                parameters: [pathParam("orderId", "Order _id")],
                requestBody: {
                    required: true,
                    content: json({
                        type: "object",
                        required: ["comment"],
                        properties: { comment: { type: "string" } },
                    }),
                },
                responses: {
                    201: ok("Created comment", ref("Comment")),
                    ...errors,
                },
            },
        },
        "/manager": {
            get: {
                tags: ["Managers (admin)"],
                summary: "Managers with statistics, 10 per page, newest first",
                security: bearer,
                parameters: [
                    queryParam("page", "Page number, default 1", {
                        type: "integer",
                    }),
                ],
                responses: {
                    200: ok("Page of managers", {
                        allOf: [
                            ref("Pagination"),
                            {
                                properties: {
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                manager: ref("User"),
                                                statistics: ref("Statistics"),
                                            },
                                        },
                                    },
                                },
                            },
                        ],
                    }),
                    401: errors[401],
                    403: errors[403],
                },
            },
            post: {
                tags: ["Managers (admin)"],
                summary: "Create manager",
                security: bearer,
                requestBody: {
                    required: true,
                    content: json({
                        type: "object",
                        required: ["email", "name", "surname"],
                        properties: {
                            email: { type: "string" },
                            name: { type: "string" },
                            surname: { type: "string" },
                        },
                    }),
                },
                responses: {
                    201: ok("Created manager", ref("User")),
                    ...errors,
                    409: {
                        description: "Email already exists",
                        content: json(ref("Error")),
                    },
                },
            },
        },
        "/manager/{id}/{action}": {
            get: {
                tags: ["Managers (admin)"],
                summary:
                    "Generate activation / password recovery link (valid 30 min)",
                security: bearer,
                parameters: [
                    pathParam("id", "Manager _id"),
                    pathParam("action", "Action", {
                        type: "string",
                        enum: ["activate", "recovery"],
                    }),
                ],
                responses: {
                    200: ok("Link", {
                        type: "string",
                        example: "http://localhost:3000/activate/<token>",
                    }),
                    ...errors,
                },
            },
            patch: {
                tags: ["Managers (admin)"],
                summary: "Ban / unban manager",
                security: bearer,
                parameters: [
                    pathParam("id", "Manager _id"),
                    pathParam("action", "Action", {
                        type: "string",
                        enum: ["ban", "unban"],
                    }),
                ],
                responses: {
                    200: ok("Updated manager", ref("User")),
                    ...errors,
                },
            },
        },
        "/manager/{action}/{token}": {
            post: {
                tags: ["Managers (admin)"],
                summary: "Set password by activation / recovery token (public)",
                parameters: [
                    pathParam("action", "Action", {
                        type: "string",
                        enum: ["activate", "recovery"],
                    }),
                    pathParam("token", "Token from the link"),
                ],
                requestBody: {
                    required: true,
                    content: json({
                        type: "object",
                        required: ["password"],
                        properties: { password: { type: "string" } },
                    }),
                },
                responses: {
                    200: ok("Manager", ref("User")),
                    400: errors[400],
                    401: errors[401],
                },
            },
        },
    },
};
