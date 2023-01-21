import { FC } from "react";
import { IClientProps } from "../constants/interfaces";
import Avatar from 'react-avatar';

const Client: FC<IClientProps> = ({ nickname, socketId }) => {
  return (
    <div className="text-xl flex flex-row items-center my-5">
      <Avatar name={nickname} size={'50'} className='rounded-lg ml-1' textSizeRatio={5}/>
      <div className="invisible text-white md:visible truncate duration-300 pl-4">{nickname}</div>
    </div>
  );
};

export default Client;
