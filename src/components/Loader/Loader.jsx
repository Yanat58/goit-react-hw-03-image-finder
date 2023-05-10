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
        wrapperStyle={{ position: 'absolute', top: '30%', left: '50%' }}
        wrapperClass="blocks-wrapper"
        colors={['#dc85e8', '#fofofo', '#843c8d', '#e286f7', '#f786ec']}
      />
    </div>
  );
}

export default Loader;
