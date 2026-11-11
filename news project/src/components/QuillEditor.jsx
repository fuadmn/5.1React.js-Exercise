import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill-new';
import './quill.snow.css'

// Use forwardRef to properly handle ref

const QuillEditor = ({ value, onChange, placeholder, className, height = 400 }, ) => {


    // Create a separate ref for the ReactQuill component

    const quillRef = useRef();

    const [editorValue, setEditorValue] = useState(value || "");


    // Update local state when prop value changes
    useEffect(() => {
        setEditorValue(value || '');
    }, [value])

    // Create a memoized onChange handler

    const handleChange = useCallback((value) => {
         setEditorValue(value)
         onChange(value)
    }, [onChange])



    // Set up editor modules
    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ]
    };


    // Set up editor formats
    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'indent', 'link', 'image', 'code-block', 'script'
    ]

    return (
        <div className={className || ""}>
            <div className="article-quill-frame">
                <ReactQuill
                    ref={quillRef}
                    value={editorValue}
                    onChange={handleChange}
                    placeholder={placeholder || "Write your content..."}
                    style={{ height: `${height}px` }}
                    modules={modules}
                    formats={formats}
                />
            </div>
        </div>
    )
}

export default QuillEditor
