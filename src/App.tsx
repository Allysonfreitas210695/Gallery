import { useState, useEffect, FormEvent } from 'react';
import * as Photos from './services/photos';
import { Photo } from './types/Photo';
import { PhotoItem } from './components/PhotoItem'
import * as C from "./App.styles";

const App = () => {
  const [uploading, setUpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listPhoto, setListPhoto] = useState<Photo[]>([]);

  useEffect(() => {
    getPhotos();
  },[])

  const getPhotos = async () => {
    setLoading(true);
    setListPhoto(await Photos.getAll());
    setLoading(false);
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formDate = new FormData(event.currentTarget);
    const file = formDate.get('image') as File;

    if(file && file.size > 0){
     setUpLoading(true);
     let result = await Photos.insert(file);
     setUpLoading(false);

     if(result instanceof Error){
       alert(`${result.name} - ${result.message}`);
     }else{
       let newList = [...listPhoto];
       newList.push(result);
       setListPhoto(newList);
     }
    }
  }

 

  const handleDeleteClick = async (name: string) => {
    await Photos.deletePhoto(name);
    getPhotos();
  }
   
  return(
    <C.Container>
      <C.Area>
        <C.Header>Galeria de Fotos</C.Header>

        {/* Area de upload */}
        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image"/>
          <input type="submit" value="Enviar"/>
          {uploading && "Enviando..."}
        </C.UploadForm>
        {loading &&
          <C.ScreenWarning>
            <div className="emoji">🖐</div>
            <div>Carregando...</div>
          </C.ScreenWarning>
        }

        {!loading && listPhoto.length > 0 &&
          <C.PhotoList>
            {listPhoto.map((item, index) => (
                <PhotoItem key={index} item={item} onDelete={handleDeleteClick}/>
                
            ))}
          </C.PhotoList>
        }
        
        {
        !loading && listPhoto.length === 0 && 
        <C.AlertMessage>
          <div className="emojiTriste">😢</div>
          <div> Você não possui Foto ainda!!</div>
        </C.AlertMessage>
        }
      </C.Area>
    </C.Container>
  )
}


export default App;
