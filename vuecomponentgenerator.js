const inquirer = require('inquirer')
const fs = require('fs')

const dryRun = false
const componentDir = './components'
const toolDir = __dirname + '\\'
const existingComponents = fs.readdirSync(componentDir)
const emptyComponentNameValue = '-NONE-'
existingComponents.unshift(emptyComponentNameValue)

const init = () => {
  promptForComponentName().then((componentName) => {
    console.log('Creating component "' + componentName + '"...')
    promptForParentComponent().then((parentComponentName) => {
      console.log('Generating component "' + componentName + '" under component "' + parentComponentName + '"')
      generate(componentName, parentComponentName)
    })
  }).catch(() => {
    console.log('You have to name your component!')
  })
}

const promptForComponentName = () => {
  return new Promise((resolve, reject) => {
    inquirer.prompt({
      type: 'input',
      name: 'componentName',
      message: 'Component name'
    }).then((answer) => {
      const name = answer.componentName
      if (name != '') {
        resolve(answer.componentName)
      } else {
        reject()
      }
    })
  })
}

const promptForParentComponent = () => {
  return new Promise((resolve) => {
    inquirer.prompt({
      type: 'list',
      name: 'parentComponentName',
      message: 'Choose parent component',
      choices: existingComponents
    }).then((answer) => {
      resolve(answer.parentComponentName)
    })
  })
}

const generate = (componentName, parentComponentName) => {
  parentComponentName = parentComponentName.replace('.vue', '')
  const templateFileLocation = toolDir + 'template.txt'
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
  if (parentComponentName != '' && parentComponentName != emptyComponentNameValue) {
    manipulateParentComponent(parentComponentName, componentName)
  }
}

const manipulateParentComponent = (parentComponentName, componentName) => {
  console.log('Manipulating parent component "' + parentComponentName + '"...')
  const parentComponentPath = componentDir + '/' + parentComponentName + '.vue'
  let parentCode = fs.readFileSync(parentComponentPath).toString()
  parentCode = parentCode.replace('<script>', '<script>\n  import ' + componentName + ' from \'./' + componentName + '.vue\'\n')
  parentCode = parentCode.replace('components: {', 'components: {\n  ' + componentName + ',\n')
  if (dryRun) {
    console.log('(no manipulating because of dry run)')
    return
  }
  fs.writeFileSync(parentComponentPath, parentCode)
  console.log('Done! Remember to auto format the parent component.')
}

init()
