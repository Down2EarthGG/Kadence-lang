const {
    createConnection,
    ProposedFeatures,
    TextDocumentSyncKind,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity
} = require('vscode-languageserver/node');

const { TextDocument } = require('vscode-languageserver-textdocument');
const { compile } = require('../compiler');

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            hoverProvider: true
        }
    };
});

// Provide Hover documentation
connection.onHover(({ textDocument, position }) => {
    const doc = documents.get(textDocument.uri);
    if (!doc) return null;

    const text = doc.getText();
    const offset = doc.offsetAt(position);

    // Simple regex to find the word under the cursor
    const wordRegex = /[a-zA-Z_]+/g;
    let match;
    let word = '';

    while ((match = wordRegex.exec(text)) !== null) {
        if (match.index <= offset && wordRegex.lastIndex >= offset) {
            word = match[0];
            break;
        }
    }

    const docs = {
        'say': 'Outputs a value to the console. Naturally readable.',
        'echo': 'An alias for `say`. Traditional debugging output.',
        'be': 'Mutable assignment. Example: `let name be "Kadence"`',
        'is': 'Immutable assignment. Example: `const pi is 3.14`',
        'function': 'Defines a reusable block of code.',
        'async': 'Defines a function that returns a Promise and can use `await`.',
        'await': 'Pauses execution until a Promise resolves.',
        'match': 'Powerful pattern matching. Use `when` and `else`.',
        'list': 'Creates a dynamic, comma-free array.',
        'object': 'Creates a poetic data structure.',
        'wait': 'Pauses the script for N seconds. Uses async/await internally.',
        'repeat': 'Simplified loop to run a block N times.'
    };

    if (docs[word]) {
        return {
            contents: {
                kind: 'markdown',
                value: `**Kadence Keyword: ${word}**\n\n${docs[word]}`
            }
        };
    }

    return null;
});

// Real-time syntax checking
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

async function validateTextDocument(textDocument) {
    const text = textDocument.getText();
    const diagnostics = [];

    try {
        compile(text, { target: 'node' });
    } catch (e) {
        // Parse line/col from Ohm ("Line N, column M") or semantic errors ("(line N, col M)")
        let line = 0;
        let character = 0;
        let message = e.message;

        const ohmMatch = message.match(/Line (\d+), column (\d+)/);
        const semanticMatch = message.match(/\(line (\d+), col (\d+)\)/);
        if (ohmMatch) {
            line = parseInt(ohmMatch[1], 10) - 1;
            character = Math.max(0, parseInt(ohmMatch[2], 10) - 1);
        } else if (semanticMatch) {
            line = parseInt(semanticMatch[1], 10) - 1;
            character = Math.max(0, parseInt(semanticMatch[2], 10) - 1);
        }

        const lines = textDocument.getText().split('\n');
        const lineLen = (lines[line] || '').length;
        diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
                start: { line, character },
                end: { line, character: Math.min(character + 1, lineLen) }
            },
            message: message,
            source: 'Kadence Compiler'
        });
    }

    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

documents.listen(connection);
connection.listen();
