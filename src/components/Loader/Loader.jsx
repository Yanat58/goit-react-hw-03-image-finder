import { ColorRing } from 'react-loader-spinner';
import css from './Loader.module.css';

function Loader() {
  return (
    <div className={css.wrapper}>
      <ColorRing
        visible={true}
        height="100"
        width="100"
        ariaLabel="blocks-loading"
        wrapperStyle={{ position: 'absolute', top: '50%', left: '50%' }}
        wrapperClass="blocks-wrapper"
        colors={['#472364', '#472364']}
      />
    </div>
  );
}

export default Loader;
