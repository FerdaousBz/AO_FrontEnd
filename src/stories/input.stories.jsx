import InputComponent from '@/components/atoms/input/input';

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
  className: '',
  disabled: false,
  hasError: '',
  label: 'Input Label',
  name: 'inputName',
  placeholder: 'Placeholder',
  type: 'text',
  value: '',
};

export const Input = {
  args,
};
