import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { CgClose } from 'react-icons/cg'
import { FiArrowLeft, FiImage, FiSave, FiTag, FiX } from 'react-icons/fi'
import QuillEditor from '../components/QuillEditor'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { uploadImage } from '../lib/storage'
import { createArticle, getArticleById, updateArticle } from '../lib/articles'




const AVAILABLE_TAGS = [
  'Somalia', 'Africa', 'World', 'Politics', 'Business', 'Technology',
  'Sports', 'Health', 'Education', 'Science', 'Environment', 'Culture',
  'Entertainment', 'Opinion'
]

const Write = () => {

  const { id } = useParams()
  console.log("id from url", id)

  const isEditMode = Boolean(id)

  // State for article tata
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [featuredImageUrl, setFeaturedImageUrl] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [error, setError] = useState(null)
  const [isLoadingArticle, setIsLoadingArticle] = useState(Boolean(id))

  // State for image upload
  const [selectedImage, setSelectedImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)


  const { user } = useAuth()
  const navigate = useNavigate()


  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isEditMode || !user) return

    let active = true
    const fetchArticle = async () => {
      try {
        setIsLoadingArticle(true)
        const article = await getArticleById(id, { includeUnpublished: true })

        if (!article) {
          setError('Article not found.')
          return
        }

        if (article.author_id !== user.id) {
          setError('You do not have permission to edit this article.')
          return
        }

        setTitle(article.title || '')
        setContent(article.content || '')
        setSelectedTags(article.tags || [])
        setFeaturedImageUrl(article.featured_image || '')
        setIsPublished(Boolean(article.published))
      } catch (fetchError) {
        console.error('Error loading article for editing:', fetchError)
        if (active) setError('Failed to load this article. Please try again.')
      } finally {
        if (active) setIsLoadingArticle(false)
      }
    }

    fetchArticle()
    return () => { active = false }
  }, [id, isEditMode, user])



  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }


  const handleContentChange = (value) => {
    setContent(value)
  }


  const handleImageSelect = (e) => {

    const file = e.target.files[0];

    if (file) {
      // check the file type

      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file")


        e.target.value = "";
        setSelectedImage(null)
        return
      }


      // check file size ( limit to 2MB)

      const maxSize = 2 * 1024 * 1024

      if (file.size > maxSize) {
        toast.error(`Image size ( ${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 2MB limit`);
        e.target.value = "";
        setSelectedImage(null)
        return
      }

      setSelectedImage(file);

      toast.success(`Select file : ${file.name}`)

    }


  }

  const handleUploadImage = async () => {

    if (!selectedImage) {
      toast.error("Please select an image")
      return
    }


    // check if the user is logged in

    if (!user) {
      toast.error("You must be signin in to upload images")
      navigate('/signin')
      return
    }


    // start uploading

    setIsUploading(true);

    console.log('Starting image upload for:', selectedImage);

    try {


      // upload image to supabase storage

      const { path, url } = await uploadImage(selectedImage, user.id);

      console.log("Image uploaded successFully", { path, url });

      setFeaturedImageUrl(url);

      // clear selected image and file input
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast.success('Image uploaded successFully')
      console.log('Image state after upload:', {
        featuredImageUrl: url,
        imageUrl: url
      })

      // Return the uploaded image data
      return { path, url }

    } catch (error) {

      console.error('Error uploading image:', error)
      toast.error(`Failed to upload image: ${error.message || 'Unknown  error'}`)
      throw error
    } finally {
      setIsUploading(false)
    }
  }


  const handleSave = async (publishStatus = null) => {


    // Validate inputs
    if (!title.trim()) {
      toast.error('Please add a title to your article')
      return
    }


    // Check for content
    if (!content || content === '<p><br></p>') {
      toast.error('Please add some content to your article')
      return
    }


    // If user not is not logged in, redirect to sign in
    if (!user) {
      toast.error('You must be signed in to save your article')
      navigate('/signin')
      return
    }


    let uploadedImageData = null

    // Check if there's selected image that hasn't been uploaded yet


    if (selectedImage) {
      console.log('Selected image needs to be uploaded first:', selectedImage)
      const ShouldUpload = confirm('You have a selected image that han yey Would you like to upload  it now?')

      if (ShouldUpload) {

        try {
          uploadedImageData = await handleUploadImage() 
          console.log('Image uploaded during save:', uploadedImageData)

          // Wait a moment fo state to update
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.error('Failed to upload image during save:', error)
          toast.error('Failed to upload image. Please try uploading the image first.')
          return
        }
      } else {
        // If user doen't went to upload the image. ask they went to proceed without it
        const shouldProceed = confirm('Do you want to proceed without uploading the image')
        if (!shouldProceed) {
          return
        }
        // Clear the selected image since user chose not to upload
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }

    setIsSaving(true);

  try {
    

    // Determine if we should update the publish status
    const published = publishStatus !== null ? publishStatus : isPublished

    // Get the  current image state, preferring newly 
    const currentImageUrl = uploadedImageData?.url || featuredImageUrl
        const articleData = {
        title,
        content,
        tags:  selectedTags,
        author_id: user.id,
        published,
        featuredImageUrl: currentImageUrl,
    }

   let saveArticle;

  
    // update

    if(isEditMode) {
      saveArticle = await updateArticle(id, user.id, articleData)
    } else {
      saveArticle = await createArticle(articleData)
    }

    
    console.log('Article saved successFully:', saveArticle)

    toast.success(`Article ${isEditMode ? 'updated' : 'create'} successFully`)
    navigate('/manage')

  } catch (error) {
    console.error('Error saving article:', error)
    toast.error('Failed to save your article. Please try again later.')
  } finally {
    setIsSaving(false)
  }
}

  return (
    <div className="article-editor-page">
      <header className="article-editor-banner">
        <div className="news-container article-editor-banner-inner">
          <div>
            <p className="article-editor-eyebrow">THE DAILY · NEWSROOM</p>
            <h1>{isEditMode ? 'Edit your story' : 'Create a new story'}</h1>
            <p>Prepare your next story for the newsroom.</p>
          </div>
          <button type="button" className="article-editor-back" onClick={() => navigate('/manage')}>
            <FiArrowLeft aria-hidden="true" /> My stories
          </button>
        </div>
      </header>

      <main className="news-container article-editor-main">
        {isLoadingArticle ? (
          <div className="article-editor-state" role="status">Loading your story…</div>
        ) : error ? (
          <div className="article-editor-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => navigate('/manage')}>Back to my stories</button>
          </div>
        ) : (
          <div className="article-editor-layout">
            <div className="article-editor-primary">
              <section className="article-editor-card article-title-card">
                <label htmlFor="title">Headline</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Write a clear, compelling headline"
                  maxLength={180}
                />
                <div className="article-title-footer">
                  <span>Make it specific and easy to understand.</span>
                  <span>{title.length}/180</span>
                </div>
              </section>

              <section className="article-editor-card article-body-card">
                <div className="article-editor-section-heading">
                  <div>
                    <span className="article-editor-section-number">01</span>
                    <h2>Story</h2>
                  </div>
                  <span>Write and format your report</span>
                </div>
                <QuillEditor
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Start writing your story…"
                  height={480}
                  className="article-quill-editor"
                />
              </section>
            </div>

            <aside className="article-editor-sidebar">
              <section className="article-editor-card article-publish-card">
                <div className="article-editor-section-heading">
                  <div>
                    <span className="article-editor-section-number">02</span>
                    <h2>Publishing</h2>
                  </div>
                </div>
                <div className="article-publish-status">
                  <span className={`article-status-dot ${isPublished ? 'is-published' : ''}`} />
                  <div>
                    <strong>{isPublished ? 'Published story' : 'Draft story'}</strong>
                    <p>{isPublished ? 'Visible to all readers' : 'Only you can see this draft'}</p>
                  </div>
                </div>
                <div className="article-editor-actions">
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={isSaving || isUploading}
                    className="article-publish-button"
                  >
                    <FiSave aria-hidden="true" />
                    {isSaving ? 'Saving…' : isPublished ? 'Update and publish' : 'Publish story'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={isSaving || isUploading}
                    className="article-draft-button"
                  >
                    Save as draft
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/manage')}
                    className="article-cancel-button"
                  >
                    <FiX aria-hidden="true" /> Cancel
                  </button>
                </div>
              </section>

              <section className="article-editor-card">
                <div className="article-editor-section-heading">
                  <div>
                    <span className="article-editor-section-number">03</span>
                    <h2>Cover image</h2>
                  </div>
                  <FiImage className="article-editor-heading-icon" aria-hidden="true" />
                </div>
                {featuredImageUrl ? (
                  <div className="article-cover-preview">
                    <img src={featuredImageUrl} alt="Story cover preview" />
                    <button
                      type="button"
                      onClick={() => {
                        setFeaturedImageUrl('')
                        setSelectedImage(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      <CgClose aria-hidden="true" /> Remove image
                    </button>
                  </div>
                ) : (
                  <label className="article-image-dropzone" htmlFor="featured-image">
                    <FiImage aria-hidden="true" />
                    <strong>{selectedImage ? selectedImage.name : 'Choose a cover image'}</strong>
                    <span>JPG, PNG or WebP · up to 2 MB</span>
                  </label>
                )}
                <input
                  id="featured-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={fileInputRef}
                  className="article-image-input"
                />
                {selectedImage && !featuredImageUrl && (
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={isUploading}
                    className="article-upload-button"
                  >
                    {isUploading ? 'Uploading…' : 'Upload cover image'}
                  </button>
                )}
              </section>

              <section className="article-editor-card">
                <div className="article-editor-section-heading">
                  <div>
                    <span className="article-editor-section-number">04</span>
                    <h2>Topics</h2>
                  </div>
                  <FiTag className="article-editor-heading-icon" aria-hidden="true" />
                </div>
                <p className="article-topics-hint">Choose topics to help readers discover your story.</p>
                {selectedTags.length > 0 && (
                  <div className="article-selected-tags" aria-label="Selected topics">
                    {selectedTags.map((tag) => (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)} aria-label={`Remove ${tag}`}>
                        {tag}<CgClose aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="article-topic-options">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={selectedTags.includes(tag) ? 'is-selected' : ''}
                      aria-pressed={selectedTags.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

export default Write
