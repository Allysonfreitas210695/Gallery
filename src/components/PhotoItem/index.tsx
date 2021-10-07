import * as C from './style';
import { Photo } from "../../types/Photo";

type Props = {
  item: Photo;
  onDelete: (name: string) => void;
}

export const PhotoItem = ({ item, onDelete }: Props) =>{
  return(
    <C.Container>
     <img src={item.url} alt={item.name}/>
     <span>{item.name}</span>
     <button onClick={ () => onDelete(item.name) }>Excluir</button>
    </C.Container>
  )
}