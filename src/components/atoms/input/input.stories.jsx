import InputComponent from './input';

const meta = {
  component: InputComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'atoms/Input',
};

export default meta;

const args = {
  className: 'string',
  disabled: false,
  hasError: false,
  label: 'string',
  max: 'string',
  min: 'string',
  name: 'string',
  placeholder: 'string',
  type: 'string',
  value: 'string',
};

export const Input = {
  args,
};
