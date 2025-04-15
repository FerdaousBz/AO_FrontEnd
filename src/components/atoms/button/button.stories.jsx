import ButtonComponent from './button';

const meta = {
  component: ButtonComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'atoms/Button',
};

export default meta;

const args = {
  as: 'button',
  children: 'button',
  className: 'string',
  disabled: false,
  icon: 'icon',
  onClick: () => {},
  size: 'small',
  variant: 'primary',
};

export const Button = {
  args,
};
