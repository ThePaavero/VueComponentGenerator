const inquirer = require('inquirer')
const fs = require('fs')

const componentDir = './components'
let componentName = ''
let parentComponentName = ''
const existingComponents = fs.readdirSync(componentDir)
existingComponents.unshift('-NONE-')

inquirer.prompt({
  type: 'input',
  name: 'componentName',
  message: 'Component name'
}).then((answer) => {
  componentName = answer.componentName
  console.log('Creating component "' + componentName + '"...')
  inquirer.prompt({
    type: 'list',
    name: 'parentComponentName',
    message: 'Choose parent component',
    choices: existingComponents
  }).then((answer) => {
    parentComponentName = answer.parentComponentName
    generate(componentName, parentComponentName)
  })
})

const generate = (componentName, parentComponentName) => {
  console.log('Generating component "' + componentName + '" under component "' + parentComponentName + '"')
  const templateFileLocation = 'D:\\node\\vuecomponentgenerator\\template.txt'
  let renderedCode = fs.readFileSync(templateFileLocation).toString()
  const tokensToValues = {
    'componentName': componentName
  }
  for (let i in tokensToValues) {
    from = '[[[' + i + ']]]'
    renderedCode = renderedCode.replace(from, tokensToValues[i])
  }
  const filename = componentDir + '/' + componentName + '.vue'
  fs.writeFileSync(filename, renderedCode)
}
