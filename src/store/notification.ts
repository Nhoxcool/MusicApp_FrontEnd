import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

type notificationType = 'error' | 'success'
interface Notification {
    message: string;
    type: notificationType;
}

const initialState : Notification = {
    message: '',
    type: 'error'
}

const slice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        upldateNotification(notification, {payload}: PayloadAction<Notification>){
            notification.message = payload.message;
            notification.type = payload.type
        }
    }
});

export const getNotificationState = createSelector((state: RootState) => state.notification,
(notificationstate) => notificationstate,
)

export const {upldateNotification} = slice.actions

export default slice.reducer