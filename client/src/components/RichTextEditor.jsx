import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const  RichTextEditor = ({input,setInput}) => {
  
const handeChange = (content) => {
    setInput({...input,description:content})
}

  return <ReactQuill theme="snow" value={input.description} onChange={handeChange} />;
}
export default RichTextEditor