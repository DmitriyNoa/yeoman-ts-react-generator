var Generator = require('yeoman-generator');
const morph = require('ts-morph');


module.exports = class extends Generator {
    start() {
        this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter a module name',
                validate: (input) => {
                    const test = /^[a-z!-]*$/.test(input);
                    if(!test) {
                        this.log("\n Please provide name according to the criteria");
                    }
                    return test;
                }
            },
            {
                type: 'confirm',
                name: 'withRouter',
                message: "Add a react route?"
            }
        ]).then((answers) => {
            // set destination folder of the projects (target)
            this.destinationRoot('./');

            // change name to CamelCase uppercase
            const componentName = answers.name.split('-').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join('');

            const componentFile = answers.withRouter ? 'route-component/route-component' : 'component/component';
            // change name to camelCase
            const componentNameCamelCase = componentName.charAt(0).toLocaleLowerCase() + componentName.slice(1);
            const name = answers.name;

            // copy template files to destination
            this.fs.copyTpl(
                this.templatePath(`${componentFile}.tsx`),
                this.destinationPath(`src/modules/${name}/${name}.tsx`),
                {componentName, componentNameCamelCase, name, }
            );

            // create morph project
            const project = new morph.Project({
                compilerOptions: {
                    target: morph.ScriptTarget.ES2015
                },
                manipulationSettings: {
                    quoteKind: morph.QuoteKind.Single
                }
            });

            // get the app source file
            const sourceFile = project.addExistingSourceFile("./src/modules/app/App.tsx");

            // add a component import
            sourceFile.addImportDeclaration({
                defaultImport: `${componentName}`,
                moduleSpecifier: `../${name}/${name}`
            });

            // find routes constant and get to the array literal
           const routes = sourceFile.getVariableDeclarationOrThrow('routes').getInitializerIfKindOrThrow(morph.SyntaxKind.ArrayLiteralExpression);

           // create a route object expression
           const route = morph.WriterFunctions.object({
               component: `<${componentName}/>`,
               route: `'/${name}'`,
           });

           routes.addElement(route);

            sourceFile.save();
        });
    }
};
