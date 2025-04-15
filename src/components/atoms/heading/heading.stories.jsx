import HeadingComponent from './heading';

const meta = {
  component: HeadingComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  title: 'atoms/Heading',
};

export default meta;

const args = {
  as: 'h1',
  bold: true,
  children: 'title',
  color: 'black',
};

export const Heading = {
  args,
};
