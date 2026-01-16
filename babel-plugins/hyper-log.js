const { default: generate } = require('@babel/generator');
const nodePath = require('path');
const caches = {};
let count = 0;

const MIN_LINE_LENGTH_BEFORE_BREAK = 50;

module.exports = () => {
  return {
    visitor: {
      CallExpression(path, state) {
        if (
          path.node.callee.object?.name === 'console' &&
          path.node.callee.property.name === 'log' &&
          path.node.arguments
        ) {
          // Prepend log path
          const file = nodePath.relative(process.cwd(), state.file.opts.filename);
          const value = `[${file}:${path.node.loc.start.line}:${path.node.loc.start.column}]`;

          if (path.node.arguments[0].value === value) {
            return; // already processed this log
          }

          path.node.arguments.unshift({
            type: 'StringLiteral',
            value,
          });
          const offset = 1; // offset for the filename position in the log

          // Colorful logs
          if (path.node.arguments.length < offset) {
            return; // no content to color
          }

          const key = generate(path.node).code;
          let fgColor, lightFgColor;
          const cachedColors = caches[key];
          if (cachedColors === undefined) {
            const color = colors[count++ % colors.length];
            fgColor = fg(color);
            lightFgColor = lightFg(color);
            caches[key] = { fgColor, lightFgColor };
          } else {
            fgColor = cachedColors.fgColor;
            lightFgColor = cachedColors.lightFgColor;
          }

          path.node.arguments.splice(offset, 0, {
            type: 'StringLiteral',
            value:
              (value.length >= MIN_LINE_LENGTH_BEFORE_BREAK ? '\n      ' : '') +
              `${bold}${fgColor}▆▆`,
          });
          for (let i = offset + 1; i < path.node.arguments.length; i++) {
            const arg = path.node.arguments[i];

            if (
              arg.type === 'TemplateLiteral' &&
              arg.expressions.length === 0 &&
              arg.quasis.length === 1
            ) {
              arg.type = 'StringLiteral';
              arg.value = `${underline}${lightFgColor}${arg.quasis[0].value.cooked.toUpperCase()}${unFg}${unUnderline}`;
            } else if (arg.type === 'TemplateLiteral') {
              let i = 0;
              for (const quasi of arg.quasis) {
                if (i)
                  quasi.value.cooked = `${fgColor}${unUnderline}}${lightFgColor}${quasi.value.cooked}`;
                if (!quasi.tail)
                  quasi.value.cooked = `${quasi.value.cooked}${unUnderline}${fgColor}\${${lightFgColor}${italic}${generate(arg.expressions[i]).code}${unItalic} = `;
                quasi.value.cooked = `${underline}${lightFgColor}${quasi.value.cooked}${unFg}${unUnderline}`;
                quasi.value.raw = uncookString(quasi.value.cooked);

                i++;
              }
            } else if (arg.value && arg.type.indexOf('Literal') !== -1) {
              arg.type = 'StringLiteral';
              arg.value = `${underline}${lightFgColor}${arg.value
                .toString()
                .toUpperCase()}${unFg}${unUnderline}`;
            }
            // if the arg does not have a label, generate one
            else if (path.node.arguments[i - 1].type !== 'StringLiteral' || i - 1 === offset) {
              const label = generate(arg).code?.replaceAll(/\s*\n+\s*/g, ' ');
              if (label) {
                path.node.arguments.splice(i, 0, {
                  type: 'StringLiteral',
                  value: `${underline}${lightFgColor}${label}${unFg}${unUnderline}`,
                });
                i++;
              }
            }
          }
          path.node.arguments.push = {
            type: 'StringLiteral',
            value: `${unBold}`,
          };
        }
      },
    },
  };
};

const bold = '\u001B[1m';
const unBold = '\u001B[22m';
const underline = '\u001B[4m';
const unUnderline = '\u001B[24m';
const italic = '\u001B[3m';
const unItalic = '\u001B[23m';
const fg = color => {
  const [red, green, blue] = rgbBlend(-0.25, hexToRgb(color));
  return `\u001B[${38};2;${red};${green};${blue}m`;
};
const lightFg = color => {
  const [red, green, blue] = rgbBlend(0.35, hexToRgb(color));
  return `\u001B[${38};2;${red};${green};${blue}m`;
};
const unFg = '\u001B[39m';
const colors = [
  '#ff0000',
  '#000080',
  '#ffa500',
  '#48d1cc',
  '#ffff00',
  '#006400',
  '#0000ff',
  '#ff00ff',
  '#00fa9a',
  '#eee8aa',
  '#ff1493',
  '#6495ed',
  '#fa8072',
];

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

// https://stackoverflow.com/a/13542669
const rgbBlend = (p, c) => {
  var r = Math.round,
    [a, b, c] = c,
    P = p < 0,
    t = P ? 0 : p * 255 ** 2,
    P = P ? 1 + p : 1 - p;
  return [r((P * a ** 2 + t) ** 0.5), r((P * b ** 2 + t) ** 0.5), r((P * c ** 2 + t) ** 0.5)];
};

const escapeChars = ['n', 'r', 't', 'v', 'f', '0'];
const uncookString = str => {
  str = str.replace(/\\|`|\${/g, '\\$&');
  for (const char of escapeChars) {
    str = str.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`);
  }

  return str;
};
