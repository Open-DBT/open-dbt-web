
import { notification } from 'antd';
import './index.less'


export const exerciseAnswerNotifiedExcetion = (message: string): void => {
  notification.open({
    icon: (
      <img
        src={require('@/img/student/icon-cuowu2.svg')}
        className="notification-icon-img"
      ></img>
    ),
    message: '',
    description: (
      <span className="notification-description-span2">
        {message}
      </span>
    ),
    closeIcon: (
      <img
        src={require('@/img/student/icon-close.svg')}
        className="notification-close-icon-img"
      ></img>
    ),
    className: 'notification-style notification-error',
    duration: 10,
  });
}

export const exerciseAnswerNotifiedFail = (message: string): void => {
  notification.open({
    icon: (
      <img src={require('@/img/student/icon-warn.svg')} className="notification-icon-img"></img>
    ),
    message: '',
    description: (
      <span className="notification-description-span2">
        {message}
      </span>
    ),
    closeIcon: (
      <img src={require('@/img/student/icon-close.svg')} width="16px" height="16px"></img>
    ),
    className: 'notification-style notification-warn',
    duration: 10,
  });
}

export const exerciseAnswerNotifiedSucc = (message: string): void => {
  notification.open({
    icon: (
      <img
        src={require('@/img/student/icon-duihao3.svg')}
        className="notification-icon-img"
      ></img>
    ),
    message: '',
    description: (
      <span className="notification-description-span1">
        {message}
      </span>
    ),
    closeIcon: (
      <img
        src={require('@/img/student/icon-close.svg')}
        className="notification-close-icon-img"
      ></img>
    ),
    className: 'notification-style notification-success',
    duration: 10,
  });
}