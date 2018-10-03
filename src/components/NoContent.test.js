import React from 'react'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import NoContent from './NoContent'

Enzyme.configure({ adapter: new Adapter() })

describe('NoContent component', () => {
  it('should render', () => {
    const wrapper = shallow(<NoContent />)
    expect(wrapper.exists()).toBe(true)
    wrapper.unmount()
  })
  it('contains an svg tag', () => {
    const wrapper = shallow(<NoContent />)
    const svgTag = wrapper.find('svg')
    expect(svgTag.exists()).toBe(true)
    wrapper.unmount()
  })
})
