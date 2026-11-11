import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Love from './pages/Love'
import About from './pages/About'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'
import Autherd from './components/Autherd'
import Write from './pages/Write'
import Manage from './pages/Manage'
import ProfilePage from './pages/ProfilePage'
import Dashboard from './pages/Dashboard'
import Protected from './components/Protected'
import { Toaster } from 'react-hot-toast'


const RedirectLegacyEditorRoute = () => {
  const { id } = useParams()
  return <Navigate to={id ? `/create/${id}` : '/create'} replace />
}

const App = () => {
  const { pathname } = useLocation()
  const isAuthPage = pathname === '/signin' || pathname === '/signup'
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('blogify-theme') === 'dark'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'
    localStorage.setItem('blogify-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <AuthProvider> 
    <div className="min-h-screen bg-white text-gray-900">
      {/* header */}
      {!isAuthPage && (
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((darkMode) => !darkMode)}
        />
      )}
      <main>
           {/* route */}

           <Routes>
               {/* pubilc routes */}
               <Route path='/' element={<HomePage/>}/>
               <Route path='/about' element={<Love/>}/>
               <Route path='/articles' element={<Navigate to='/about' replace/>}/>
               <Route path='/article/:id' element={<About/>}/>

               {/* unauthenticated routes (redirect to home if logged in ) */}

               <Route path='/signin' element={
                <Autherd>
                   <SignInPage
                     isDarkMode={isDarkMode}
                     onToggleTheme={() => setIsDarkMode((darkMode) => !darkMode)}
                   />
                </Autherd>
                
                }/>
               <Route path='/signup' element={
                 <Autherd>
                   <SignUpPage
                     isDarkMode={isDarkMode}
                     onToggleTheme={() => setIsDarkMode((darkMode) => !darkMode)}
                   />
                </Autherd>
                
                }/>

           
               {/* Protected Routes */}

               <Route path='/dashboard' element={
                <Protected>
                  <Dashboard/>
                </Protected>
               }/>

               <Route path='/create' element={
              <Protected>
                <Write/>
              </Protected>
              }/>

             <Route path='/create/:id' element={
               <Protected>
                <Write/>
              </Protected>
              }/>

             <Route path='/editor' element={<Navigate to='/create' replace />} />
             <Route path='/editor/:id' element={<RedirectLegacyEditorRoute />} />

             <Route path='/manage' element={
               <Protected>
                <Manage/>
              </Protected>
             }/>
             <Route path='/manage-articles' element={<Navigate to='/manage' replace/>}/>

             <Route path='/profile' element={
               <Protected>
                 <ProfilePage/>
              </Protected>
             }/>

                
           </Routes>
      </main>
      {/* footer */}
      {!isAuthPage && <Footer/>}
    </div>
      <Toaster
        toastOptions={{
          style: {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#f9fafb' : '#111827',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App
