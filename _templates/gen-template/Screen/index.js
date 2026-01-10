const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const recast = require('recast');
const changeCase = require('change-case');
const b = recast.types.builders;

const navigationDir = 'src/navigation/';
const navigatorFiles = fs.readdirSync(navigationDir);
const navigators = navigatorFiles.map(file => {
  const res = file.split('.')[0];
  return res === 'navigation' ? 'ApplicationStack' : res;
});

const i18nFileDir = 'src/i18n/resources/';
const i18nFileName = 'common.json';

const PASCAL_REGEX = /^[A-Z][a-zA-Z]*$/;

module.exports = {
  prompt: async ({ prompter, args }) => {
    const result = await prompter.prompt([
      {
        type: 'input',
        name: 'name',
        message: "What's your screen name?",
        validate: name => PASCAL_REGEX.test(name),
      },
      {
        type: 'select',
        name: 'navigator',
        message: "What's your screen's navigator?",
        choices: [...navigators],
      },
    ]);

    const navigationFilePath = navigationDir + navigatorFiles[navigators.indexOf(result.navigator)];
    const navigationSource = fs.readFileSync(navigationFilePath, 'utf8');
    const ast = recast.parse(navigationSource, {
      parser: require('recast/parsers/babel-ts'),
    });

    const navigatorImport = navigationFilePath.split('.')[0];
    let navigatorPropsImport;
    let navigatorType;
    for (const node of ast.program.body) {
      let found = false;
      if (node.specifiers) {
        for (const specifier of node.specifiers) {
          const matches = /^create(.+)Navigator$/.exec(specifier?.imported?.name);
          if (matches?.[1]) {
            navigatorType = matches[1];
            navigatorPropsImport = node.source?.value;
            found = true;
            break;
          }
        }
      }
      if (found) break;
    }

    const overridePrompt = async () =>
      (
        await prompter.prompt({
          type: 'confirm',
          name: 'overwrite',
          message: `Screen '${result.name}' already exists in ${result.navigator} navigator. Overwrite?`,
          default: false,
        })
      ).override;

    let willRecast;
    let paramList;
    const navigatorComps = [];
    recast.visit(ast, {
      visitExportNamedDeclaration(path) {
        if (
          path.value.declaration?.id?.name === result.navigator + 'ParamList' &&
          path.value.declaration.typeAnnotation?.members
        ) {
          paramList = path.value.declaration.typeAnnotation.members;
        }
        this.traverse(path);
      },
      visitJSXElement(path) {
        if (path.value.openingElement.name?.property?.name === 'Navigator') {
          navigatorComps.push(path.value);
        }
        this.traverse(path);
      },
      visitJSXText(path) {
        // recast removes newlines in jsx elements for some reason. I have to put them back
        if (path.value.value?.match(/\n/g)?.length > 1) {
          const newLineElement = b.jsxText('\n');
          path.insertAfter(newLineElement);
        }
        this.traverse(path);
      },
    });

    // Add new screen to navigator param list
    if (
      paramList &&
      !(
        willRecast === undefined &&
        paramList.find(member => member?.key?.name === result.name) &&
        !(await overridePrompt())
      )
    ) {
      const screenType = b.tsPropertySignature(
        b.identifier(result.name),
        b.tsTypeAnnotation(b.tsUndefinedKeyword()),
      );
      paramList.push(screenType);
      willRecast = true;
    }

    // Add new screen to navigator component
    for (const navigatorComp of navigatorComps) {
      if (
        !(
          willRecast === undefined &&
          navigatorComp.children.find(
            child =>
              child?.openingElement?.attributes?.find(attr => attr?.name?.name === 'name')?.value
                ?.value === result.name,
          ) &&
          !(await overridePrompt())
        )
      ) {
        const screenElement = b.jsxElement(
          b.jsxOpeningElement(
            b.jsxMemberExpression(
              b.jsxIdentifier(navigatorComp.openingElement.name.object.name),
              b.jsxIdentifier('Screen'),
            ),
            [
              b.jsxAttribute(b.jsxIdentifier('name'), b.stringLiteral(result.name)),
              b.jsxAttribute(
                b.jsxIdentifier('component'),
                b.jsxExpressionContainer(b.identifier(result.name + 'Screen')),
              ),
            ],
            true,
          ),
          null,
          [],
        );
        const addIndex = navigatorComp.children.findLastIndex(child => child.type === 'JSXText');
        navigatorComp.children.splice(addIndex, 0, screenElement);
        willRecast = true;
      }
    }

    // Add new screen import statement
    if (willRecast) {
      const screenImport = b.importDeclaration(
        [b.importDefaultSpecifier(b.identifier(result.name + 'Screen'))],
        b.stringLiteral('src/screens/' + result.name + '/' + result.name),
      );
      ast.program.body.unshift(screenImport);
    }

    const recastedCode = recast.print(ast).code;
    const options = await prettier.resolveConfig(navigationFilePath);
    const { inferredParser } = await prettier.getFileInfo(navigationFilePath);
    const formattedCode = await prettier.format(recastedCode, {
      ...options,
      parser: inferredParser,
    });
    fs.writeFileSync(navigationFilePath, formattedCode, 'utf8');

    // Add new screen name to i18n file
    const dirs = fs
      .readdirSync(i18nFileDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dir => dir.name);

    for (const dir of dirs) {
      try {
        const fileName = path.join(i18nFileDir, dir, i18nFileName);
        const content = JSON.parse(fs.readFileSync(fileName, 'utf8'));
        content.screens[changeCase.camelCase(result.name)] = changeCase.sentenceCase(result.name);

        fs.writeFileSync(fileName, JSON.stringify(content, null, 2), 'utf8');
      } catch (e) {
        if (!e?.message.includes('no such file or directory')) {
          throw e;
        }
      }
    }

    return { ...result, navigatorImport, navigatorPropsImport, navigatorType };
  },
};
