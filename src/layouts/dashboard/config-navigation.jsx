import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'device',
    path: '/device',
    icon: icon('ic_device'),
  },
  {
    title: 'dataset',
    path: '/dataset',
    icon: icon('ic_dataset'),
  },
  {
    title: 'unanswered',
    path: '/unanswered',
    icon: icon('ic_question'),
  },
  {
    title: 'product',
    path: '/product',
    icon: icon('ic_product'),
  },
];

export default navConfig;
