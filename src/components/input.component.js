import { div } from '../libs/dom.js'
import { makeBaseComponent } from '../common/index.js'
import { makeInputE } from '../elements/input.element.js'
import { makeMiddleColAdaptiveLayoutE } from '../elements/layout-middle_col_adaptive.element.js'
import { map } from '../libs/rx.js'

const makeInputVNode = ({ unique, children, config }) => {
  const { field } = config
  return makeMiddleColAdaptiveLayoutE({
    unique: unique,
    selector: '.mobius-margin-y--base',
    props: {},
    config: { withAbsMidWrapper: false },
    children: {
      left: div('.mobius-padding-y--base', field),
      middle: makeInputE({
        unique: `${unique}__input`,
        selector: '.mobius-margin-x--base.mobius-flex-grow--1',
        props: { },
        chilren: children,
        config: { ...config }
      })
    }
  })
}

const makeInputC = ({
  unique, children, componentToDriverMapper, driver, driverToComponentMapper, config
} = {}) => {
  return makeBaseComponent({
    children: children,
    intent: source => source.DOM.select(`.js_${unique} input`).events('input').pipe(
      map(componentToDriverMapper)
    ),
    model: intent$ => driver(intent$),
    view: model$ => {
      const renders$ = model$.pipe(map(([driverOutput, childsDOM]) => [driverToComponentMapper(driverOutput), childsDOM]))
      return {
        DOM: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return makeInputVNode({ unique, children: childsDOM, config: { ...config, ...outerConfig } })
          })
        ),
        hyper: renders$.pipe(
          map(([outerConfig, childsDOM]) => {
            return children => makeInputVNode({ unique, children: [...childsDOM, ...children], config: { ...config, ...outerConfig } })
          })
        )
      }
    }
  })
}

export { makeInputC }