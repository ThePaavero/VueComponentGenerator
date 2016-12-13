const inquirer = require('inquirer')
const fs = require('fs')

const dryRun = true
const componentDir = './components'
const existingComponents = fs.readdirSync(componentDir)
existingComponents.unshift('-NONE-')

let componentName = ''
let parentComponentName = ''

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
    renderedCode = renderedCode.replace('[[[' + i + ']]]', tokensToValues[i])
  }
  const filename = componentDir + '/' + componentName + '.vue'
  fs.writeFileSync(filename, renderedCode)
  console.log('Done!')
  if (dryRun) {
    fs.unlinkSync(filename)
    console.log('(unlinked because of dry run)')
  }
  if (parentComponentName != '') {
    manipulateParentComponent(parentComponentName, componentName)
  }
}

const manipulateParentComponent = (parentComponentName, componentName) => {
  console.log('Manipulating parent component "' + parentComponentName + '"...')
}
