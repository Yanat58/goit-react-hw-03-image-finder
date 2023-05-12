import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchImages from 'services/images-api';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Button from 'components/Button/Button';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';

export class App extends Component {
  state = {
    query: '',
    page: 1,
    totalHits: 0,
    isLoading: false,
    showModal: false,
    images: [],
    error: null,
    currentImageUrl: null,
    currentImageDescription: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page, images } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.setState(({ isLoading }) => ({ isLoading: !isLoading }));

      fetchImages(query, page)
        .then(({ hits, totalHits }) => {
          if (totalHits === 0) {
            toast.warn(
              'Sorry, there are no images matching your search query. Please try again.'
            );
            return;
          }

          if (page === 1) {
            toast.info(`Hooray! We found ${totalHits} images.`);
          }

          if (page * 12 >= totalHits) {
            toast.info(
              `We're sorry, but you've reached the end of search results.`
            );
          }

          const gallery = hits.map(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id,
              description: tags,
              smallImage: webformatURL,
              largeImage: largeImageURL,
            })
          );

          this.setState(() => {
            return {
              images: [...images, ...gallery],
              showBtn: page * 12 < totalHits,
            };
          });
        })
        .catch(error => toast.error(error.message, 'Something went wrong!'))
        .finally(() =>
          this.setState(({ isLoading }) => ({ isLoading: !isLoading }))
        );
    }
  }

  getSearchRequest = (query, images) => {
    this.setState({ query, page: 1, images: []});
  };

  onNextFetch = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  openModal = e => {
    const currentImageUrl = e.target.dataset.large;
    const currentImageDescription = e.target.alt;

    if (e.target.nodeName === 'IMG') {
      this.setState(({ showModal }) => ({
        showModal: !showModal,
        currentImageUrl: currentImageUrl,
        currentImageDescription: currentImageDescription,
      }));
    }
  };

  render() {
    const {
      images,
      showBtn,
      isLoading,
      showModal,
      currentImageUrl,
      currentImageDescription,
    } = this.state;

    const getSearchRequest = this.getSearchRequest;
    const onNextFetch = this.onNextFetch;
    const openModal = this.openModal;
    const toggleModal = this.toggleModal;

    return (
      <>
        <Searchbar onSubmit={getSearchRequest} />

        {images && <ImageGallery images={images} openModal={openModal} />}

        {isLoading && <Loader />}

        {showBtn && <Button onNextFetch={onNextFetch} />}

        {showModal && (
          <Modal
            onClose={toggleModal}
            currentImageUrl={currentImageUrl}
            currentImageDescription={currentImageDescription}
          />
        )}

        <ToastContainer theme="colored" autoClose={2500} />
      </>
    );
  }
}
