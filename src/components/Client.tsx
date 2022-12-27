import { FC } from "react";
import { IClientProps } from "../constants/interfaces";
import Avatar from 'react-avatar';

const Client: FC<IClientProps> = (props) => {
  return (
    <div className="text-xl flex items-center">
      <Avatar name={props.nickname} size={'50'} className='rounded-lg' textSizeRatio={5}/>
      <div className="font">{props.nickname}</div>
    </div>
  );
};

export default Client;
