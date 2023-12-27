import { Keys, getFromAsyncStorage } from '@utils/AsyncStorage';
import {useQuery} from 'react-query';
import {useDispatch} from 'react-redux';
import {AudioData, History, Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {getClient} from 'src/api/client';
import {upldateNotification} from 'src/store/notification';

const fetchLatest = async (): Promise<AudioData[]> => {
  const client = await getClient()
  const {data} = await client('/audio/latest');
  return data.audios;
};

export const useFetchLatestAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['latest-uploads'], {
    queryFn: () => fetchLatest(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};


const fetchRecommended = async (): Promise<AudioData[]> => {
  const client = await getClient()
  const {data} = await client('/profile/recommended');
  return data.audios;
};

export const useFetchRecommendedAudios = () => {
  const dispatch = useDispatch();
  return useQuery(['recommended'], {
    queryFn: () => fetchRecommended(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};


const fetchPlaylist = async (): Promise<Playlist[]> => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN)
  const client = await getClient()
  const {data} = await client('/playlist/by-profile', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
  });
  return data.playlist;
};

export const useFetchPlaylist = () => {
  const dispatch = useDispatch();
  return useQuery(['playlist'], {
    queryFn: () => fetchPlaylist(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};


const fetchUploadByProfile = async (): Promise<AudioData[]> => {
  const client = await getClient()
  const {data} = await client('/profile/uploads');
  return data.audios;
};

export const useFetchUploadsByProfile = () => {
  const dispatch = useDispatch();
  return useQuery(['upload-by-profile'], {
    queryFn: () => fetchUploadByProfile(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};



const fetchFavorites = async (): Promise<AudioData[]> => {
  const client = await getClient()
  const {data} = await client('/favorite');
  return data.audios;
};

export const useFetchFavorite = () => {
  const dispatch = useDispatch();
  return useQuery(['favorie'], {
    queryFn: () => fetchFavorites(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};


const fetchHistorites = async (): Promise<History[]> => {
  const client = await getClient()
  const {data} = await client('/history');
  return data.histories;
};

export const useFetchHistory = () => {
  const dispatch = useDispatch();
  return useQuery(['histories'], {
    queryFn: () => fetchHistorites(),
    onError(err) {
      const errorMessage = catchAsyncError(err);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    },
  });
};


