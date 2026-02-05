const { compile } = require("./compiler");

/**
 * Vite plugin for Kadence (.kade) files
 */
function kadencePlugin() {
    return {
        name: "vite-plugin-kadence",

        transform(code, id) {
            if (!id.endsWith(".kade")) {
                return null;
            }

            // Compile Kadence to JS with Source Maps
            const result = compile(code, {
                target: "browser",
                sourcemap: true,
                sourceFile: id
            });

            return {
                code: result.code,
                map: result.map
            };
        },

        handleHotUpdate({ file, server, read: _read }) {
            if (file.endsWith(".kade")) {
                server.ws.send({
                    type: "full-reload",
                    path: "*"
                });
            }
        }
    };
}

module.exports = { kadencePlugin };
