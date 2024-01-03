import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

interface PlaylistModal {
  visible: boolean;
  selectedListId?: string;
  isPrivate?: boolean;
  allowPlaylistAudioRemove?:boolean
}

const initialState: PlaylistModal = {
  visible: false,

};

const slice = createSlice({
  name: 'PlaylistModal',
  initialState,
  reducers: {
    updatePlaylistVisibility(
      playerState,
      {payload}: PayloadAction<boolean>,
    ) {
      playerState.visible = payload;
    },
    updateSelectedListId(playerState, {payload}: PayloadAction<string>) {
      playerState.selectedListId = payload;
    },
    updateIsPlaylistPrivate(playerState, {payload}: PayloadAction<boolean>) {
      playerState.isPrivate = payload;
    },
    updateAllowPlaylistAudioRemove(playerState, {payload}: PayloadAction<boolean>) {
      playerState.allowPlaylistAudioRemove = payload;
    },
  },
});

export const getPlaylistModalState = createSelector(
  (state: RootState) => state.playlistModal,
  modalState => modalState,
);

export const {updatePlaylistVisibility,updateSelectedListId, updateIsPlaylistPrivate, updateAllowPlaylistAudioRemove} = slice.actions;

export default slice.reducer;
