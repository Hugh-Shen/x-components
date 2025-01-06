
const _bem = (prefixName: string, blockSuffix: string, element: string, modifier: string) => {
  if (blockSuffix) {
    prefixName += `-${blockSuffix}`
  }

  if (element) {
    prefixName += `__${element}`
  }

  if (modifier) {
    prefixName += `--${modifier}`
  }

  return prefixName
}

const createBEM = (prefixName: string) => {


  return {

  }
}

const createNamespace = (name: string) => {
  const namespace = `x-${name}`
  return createBEM(namespace)
}