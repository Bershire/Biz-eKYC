// Modified from https://github.com/chocolateboy/babel-plugin-inline-functions
// With support for inlining function's body

const OPTIONS = {
  comment: false,
  label: false,
  prefix: '__INLINE__',
  remove: true,
};

const argumentsInliningVisitor = {
  Identifier(path) {
    for (let i = 0; i < this.params.length; i++) {
      if (path.node.name === this.params[i].name) {
        if (this.args[i]) {
          path.replaceWith(this.args[i]);
          path.skip(); // don't recurse
        } else {
          path.replaceWithSourceString('undefined');
        }
      }
    }
  },
};

const returnStatementVisitor = {
  FunctionDeclaration(path) {
    path.skip();
  },
  FunctionExpression(path) {
    path.skip();
  },
  ArrowFunctionExpression(path) {
    path.skip();
  },
  ReturnStatement(path) {
    path.replaceWithMultiple([
      this.types.expressionStatement(path.node.argument),
      this.types.breakStatement(this.breakLabelIdentifier),
    ]);
    this.returnCount++;
  },
};

const inlineFunctionVisitor = {
  CallExpression(path) {
    if (path.node.callee.name === this.name) {
      const { params } = this;
      const args = path.node.arguments; // grab these before we replace the node

      // Special case: function with a single return statement
      if (
        this.bodyStatements.length === 1 &&
        this.types.isReturnStatement(this.bodyStatements[0])
      ) {
        const returnStatement = this.types.cloneDeep(this.bodyStatements[0]);

        path.replaceWith(returnStatement);
        path.traverse(argumentsInliningVisitor, { args, params });
        path.replaceWith(returnStatement.argument);
        return;
      }

      const clonedStatements = this.bodyStatements.map(st => this.types.cloneDeep(st));
      let tempBlock = this.types.blockStatement(clonedStatements);

      // If nothing cares about the function result, put the function body directly into the code
      if (this.types.isExpressionStatement(path.parentPath)) {
        // There are 3 container types:
        //  - none: the function body will be put without any extra container
        //  - block: the function body will be put inside a block to prevent variable declaration collision
        //  - do-while: function with return will be put inside a do-while(false) with return statements replaced by break statements
        let containerType = 'none';

        if (params.length) {
          const paramVarDeclarators = params.map((param, i) => {
            return this.types.variableDeclarator(
              this.types.identifier(param.name),
              args[i] || null,
            );
          });

          const paramVarDeclaration = this.types.variableDeclaration('let', paramVarDeclarators);
          clonedStatements.unshift(paramVarDeclaration);

          containerType = 'block';
        } else if (tempBlock.body.find(n => this.types.isDeclaration(n))) {
          containerType = 'block';
        }

        path.parentPath.replaceWith(tempBlock);
        const breakLabelIdentifier = path.parentPath.scope.generateUidIdentifier('breaklabel');
        const returnStatementState = { returnCount: 0, breakLabelIdentifier, types: this.types };
        path.parentPath.traverse(returnStatementVisitor, returnStatementState);

        if (returnStatementState.returnCount) {
          containerType = 'do-while';
        }

        switch (containerType) {
          case 'block':
            path.parentPath.replaceWith(tempBlock);
            break;
          case 'do-while':
            tempBlock = this.types.labeledStatement(
              breakLabelIdentifier,
              this.types.doWhileStatement(this.types.booleanLiteral(false), tempBlock),
            );
            path.parentPath.replaceWith(tempBlock);
            break;
          case 'none':
            path.parentPath.replaceWithMultiple(tempBlock.body);
            break;
        }

        // Else, put it inside an anonymous function and run as an expression
      } else {
        const functionExpression = this.types.functionExpression(null, params, tempBlock);
        path.node.callee = functionExpression;
      }
    }
  },
  Identifier(path) {
    if (
      path.node.name === this.name &&
      !path.parentPath.isDeclaration() &&
      !path.parentPath.isVariableDeclarator() &&
      !path.parentPath.isAssignmentExpression()
    ) {
      const clonedStatements = this.bodyStatements.map(st => this.types.cloneDeep(st));
      const tempBlock = this.types.blockStatement(clonedStatements);
      const functionExpression = this.types.functionExpression(null, this.params, tempBlock);

      path.replaceWith(functionExpression);
    }
  },
};

function findComment(node, want) {
  const comments = node.leadingComments || [];

  for (let i = comments.length - 1; i >= 0; --i) {
    const comment = comments[i];

    if (comment.type !== 'CommentBlock') {
      break;
    }

    if (comment.value.trim() === want) {
      return `leadingComments.${i}`;
    }
  }
}

function hasSingleStatement(node) {
  return node.body.body.length === 1;
}

function matchLabel(types, statement, label) {
  return types.isLabeledStatement(statement) && statement.label.name === label;
}

module.exports = function ({ types }, options) {
  const { comment, label, prefix, remove } = Object.assign({}, OPTIONS, options);

  if (!(comment || label || prefix)) {
    return {};
  }

  return {
    visitor: {
      FunctionDeclaration(path) {
        const { node } = path;
        const { name } = node.id;

        let bodyStatements = node.body.body;
        let commentPath;

        if (prefix && name.startsWith(prefix)) {
          // do nothing
        } else if (
          label &&
          hasSingleStatement(node) &&
          matchLabel(types, bodyStatements[0], label)
        ) {
          const labeledStatement = bodyStatements[0];
          if (labeledStatement.body.type === 'BlockStatement')
            bodyStatements = labeledStatement.body.body;
          else {
            bodyStatements = [labeledStatement.body];
          }
        } else if (comment && (commentPath = findComment(node, comment))) {
          if (remove) {
            // remove the comment so it doesn't get attached to the
            // next declaration
            path.get(commentPath).remove();
          }
        } else {
          return;
        }

        path.parentPath.traverse(inlineFunctionVisitor, {
          name,
          params: node.params,
          bodyStatements,
          types,
        });

        if (remove) {
          path.remove();
        }
      },
    },
  };
};
