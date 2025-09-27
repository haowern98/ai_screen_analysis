import { useEffect, useState } from 'react'
import './App.css'

type Theme = 'light' | 'dark'
type Mode = 'lecture' | 'interview'
type LectureView = 'live' | 'slides'
type AssistantTab = 'summaries' | 'chat'
type InterviewView = 'live' | 'documents'

type LectureSummaryType = 'Summary' | 'Key Point' | 'Question' | 'Action Item'

type LectureSummary = {
  id: number
  type: LectureSummaryType
  time: string
  title: string
  detail: string
}

type LectureChatEntry = {
  id: number
  role: 'user' | 'assistant'
  time: string
  message: string
}

type SlideCard = {
  id: string
  title: string
  duration: string
  notes: number
  description: string
  tags: string[]
  lastAnnotated: string
}

type TranscriptEntry = {
  id: number
  time: string
  speaker: 'Candidate' | 'Interviewer'
  message: string
  aiReply?: string
}

type LiveInsight = {
  id: string
  title: string
  detail: string
  tone: 'positive' | 'neutral' | 'warning'
}

type DocumentItem = {
  id: string
  name: string
  status: 'Processed' | 'Pending'
  updated: string
  size: string
  category: 'Resume' | 'Portfolio' | 'Notes'
}

const lectureSummaries: LectureSummary[] = [
  {
    id: 1,
    type: 'Summary',
    time: '00:01:00',
    title: 'Introduction to machine learning fundamentals',
    detail: 'Covered supervised vs. unsupervised learning and where each excels in production systems.'
  },
  {
    id: 2,
    type: 'Key Point',
    time: '00:03:15',
    title: 'Neural networks model non-linear relationships',
    detail: 'Hidden layers and activation functions allow the model to approximate complex decision boundaries.'
  },
  {
    id: 3,
    type: 'Question',
    time: '00:05:50',
    title: 'What are the trade-offs between accuracy and interpretability?',
    detail: 'Instructor asked for class discussion on how explainability changes depending on the algorithm.'
  },
  {
    id: 4,
    type: 'Action Item',
    time: '00:08:10',
    title: 'Download annotated slide deck after the session',
    detail: 'Includes instructor notes and highlighted sections focusing on optimization algorithms.'
  }
]

const lectureChat: LectureChatEntry[] = [
  {
    id: 1,
    role: 'user',
    time: '00:10:02',
    message: 'Can you clarify how gradient descent updates the weights?' 
  },
  {
    id: 2,
    role: 'assistant',
    time: '00:10:04',
    message: 'Absolutely. Each iteration computes the gradient of the loss function with respect to the weights and then nudges the weights in the opposite direction of that gradient.'
  },
  {
    id: 3,
    role: 'assistant',
    time: '00:10:04',
    message: 'The learning rate controls how big that nudge is. Too large and you overshoot minima, too small and training slows dramatically.'
  }
]

const slideLibrary: SlideCard[] = [
  {
    id: 'slide-1',
    title: 'Introduction to Machine Learning',
    duration: '00:02:15',
    notes: 3,
    description: 'Overview of supervised, unsupervised, and reinforcement learning paradigms with industry examples.',
    tags: ['ml', 'overview', 'applications'],
    lastAnnotated: 'Today 09:05'
  },
  {
    id: 'slide-2',
    title: 'Neural Network Architecture',
    duration: '00:05:30',
    notes: 5,
    description: 'Visual breakdown of layers, activation functions, and how backpropagation flows through the network.',
    tags: ['neural networks', 'layers', 'activation'],
    lastAnnotated: 'Today 09:12'
  },
  {
    id: 'slide-3',
    title: 'Training Algorithms',
    duration: '00:08:45',
    notes: 4,
    description: 'Comparison of SGD, Adam, and RMSProp plus annotated examples of convergence curves.',
    tags: ['optimization', 'gradient descent', 'training'],
    lastAnnotated: 'Today 09:24'
  },
  {
    id: 'slide-4',
    title: 'Practical Applications',
    duration: '00:04:20',
    notes: 2,
    description: 'Real-world deployments in computer vision, NLP, and recommendation engines with call-outs on ROI.',
    tags: ['vision', 'nlp', 'use cases'],
    lastAnnotated: 'Today 09:37'
  }
]

const interviewTranscript: TranscriptEntry[] = [
  {
    id: 1,
    time: '00:02:12',
    speaker: 'Interviewer',
    message: 'Can you share a project where you improved system reliability?',
    aiReply: 'Highlight on-call rotations or automated rollback strategies if available.'
  },
  {
    id: 2,
    time: '00:03:01',
    speaker: 'Candidate',
    message: 'I led the rollout of a canary deployment pipeline that reduced incidents by 37% within three months.'
  },
  {
    id: 3,
    time: '00:04:18',
    speaker: 'Interviewer',
    message: 'How did you measure success during that rollout?',
    aiReply: 'Follow-up prompt: Ask about key metrics and how the team responded to regressions.'
  },
  {
    id: 4,
    time: '00:04:46',
    speaker: 'Candidate',
    message: 'We tracked deployment frequency, mean time to recovery, and customer-facing incidents. All trends improved week over week.'
  }
]

const interviewInsights: LiveInsight[] = [
  {
    id: 'insight-1',
    title: 'Strength: Deployment ownership',
    detail: 'Candidate demonstrated end-to-end ownership of deployment strategy including monitoring and rollback.',
    tone: 'positive'
  },
  {
    id: 'insight-2',
    title: 'Follow-up opportunity',
    detail: 'Clarify how they handled cross-team communication during the rollout to gauge collaboration depth.',
    tone: 'neutral'
  },
  {
    id: 'insight-3',
    title: 'Confidence spike detected',
    detail: 'Noticeable energy increase when discussing automation. Consider deeper dive on tooling preferences.',
    tone: 'warning'
  }
]

const interviewDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Jordan-Avery-Resume.pdf',
    status: 'Processed',
    updated: '2 mins ago',
    size: '1.2 MB',
    category: 'Resume'
  },
  {
    id: 'doc-2',
    name: 'System-Design-Notes.docx',
    status: 'Processed',
    updated: '15 mins ago',
    size: '860 KB',
    category: 'Notes'
  },
  {
    id: 'doc-3',
    name: 'Portfolio-Case-Studies.zip',
    status: 'Pending',
    updated: 'Awaiting analysis',
    size: '12.4 MB',
    category: 'Portfolio'
  }
]

function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [activeMode, setActiveMode] = useState<Mode>('lecture')
  const [lectureView, setLectureView] = useState<LectureView>('live')
  const [assistantTab, setAssistantTab] = useState<AssistantTab>('summaries')
  const [interviewView, setInterviewView] = useState<InterviewView>('live')

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light')
    document.body.classList.add(`theme-${theme}`)
  }, [theme])

  return (
    <div className={`app theme-${theme}`}>
      <header className="top-bar">
        <div className="brand">
          <span className="brand-icon">⚡</span>
          <div className="brand-text">
            <span className="brand-name">AiScreen</span>
            <span className="brand-tagline">Real-time intelligence</span>
          </div>
        </div>

        <nav className="main-nav">
          <button
            className={`nav-link ${activeMode === 'lecture' ? 'active' : ''}`}
            onClick={() => setActiveMode('lecture')}
            type="button"
          >
            Lecture
          </button>
          <button
            className={`nav-link ${activeMode === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveMode('interview')}
            type="button"
          >
            Interview
          </button>
        </nav>

        <div className="top-bar-actions">
          <button className="record-button" type="button">Start Recording</button>
          <button
            className="theme-toggle"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            type="button"
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeMode === 'lecture' ? (
          <section className="mode-section">
            <div className="mode-header">
              <div>
                <h1>Lecture Analysis</h1>
                <p className="mode-subtitle">Real-time analysis and slide review with annotated summaries every minute.</p>
              </div>
              <div className="pill-tabs">
                <button
                  className={`pill ${lectureView === 'live' ? 'selected' : ''}`}
                  onClick={() => setLectureView('live')}
                  type="button"
                >
                  Live Analysis
                </button>
                <button
                  className={`pill ${lectureView === 'slides' ? 'selected' : ''}`}
                  onClick={() => setLectureView('slides')}
                  type="button"
                >
                  Review Slides
                </button>
              </div>
            </div>

            <div className="content-grid">
              <div className="primary-column">
                {lectureView === 'live' ? (
                  <>
                    <section className="card large-card">
                      <header className="card-header">
                        <div>
                          <span className="chip chip-blue">Screen Capture</span>
                          <h2>Screen Capture Ready</h2>
                          <p className="card-subtitle">Start recording to begin screen analysis and annotation.</p>
                        </div>
                        <button className="round-button" type="button">⚙️</button>
                      </header>
                      <div className="card-body placeholder">
                        <span className="placeholder-icon">🖥️</span>
                        <p>Waiting for shared screen...</p>
                      </div>
                    </section>

                    <section className="card medium-card">
                      <header className="card-header">
                        <div>
                          <span className="chip chip-purple">Audio Analysis</span>
                          <h2>Audio capture ready</h2>
                          <p className="card-subtitle">Start recording to generate minute-by-minute summaries.</p>
                        </div>
                        <button className="round-button" type="button">🎚️</button>
                      </header>
                      <div className="timeline">
                        <div className="timeline-row">
                          <div className="timeline-time">00:00</div>
                          <div className="timeline-event">Listening for incoming audio...</div>
                        </div>
                        <div className="timeline-row muted">
                          <div className="timeline-time">00:01</div>
                          <div className="timeline-event">Summary will appear here once recording starts.</div>
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <section className="card large-card">
                    <header className="card-header">
                      <div>
                        <span className="chip chip-green">Slide Library</span>
                        <h2>Annotated slide deck</h2>
                        <p className="card-subtitle">Browse all captured slides with AI-generated highlights.</p>
                      </div>
                      <div className="slide-controls">
                        <input className="search" placeholder="Search slides..." type="search" />
                        <button className="icon-button" type="button">🔍</button>
                      </div>
                    </header>

                    <div className="slide-filters">
                      <button className="tag-button selected" type="button">All</button>
                      <button className="tag-button" type="button">Most Annotated</button>
                      <button className="tag-button" type="button">Recent</button>
                      <button className="tag-button" type="button">Favorites</button>
                    </div>

                    <div className="slide-grid">
                      {slideLibrary.map((slide) => (
                        <article className="slide-card" key={slide.id}>
                          <div className="slide-header">
                            <span className="slide-duration">{slide.duration}</span>
                            <span className="slide-notes">{slide.notes} notes</span>
                          </div>
                          <div className="slide-thumbnail">📑</div>
                          <h3>{slide.title}</h3>
                          <p className="slide-description">{slide.description}</p>
                          <div className="slide-tags">
                            {slide.tags.map((tag) => (
                              <span className="slide-tag" key={tag}>{tag}</span>
                            ))}
                          </div>
                          <footer className="slide-footer">
                            <span className="slide-updated">Last annotated: {slide.lastAnnotated}</span>
                            <button className="outline-button" type="button">Open</button>
                          </footer>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="secondary-column">
                <section className="card assistant-card">
                  <header className="card-header">
                    <div>
                      <span className="chip chip-gold">AI Lecture Assistant</span>
                      <h2>Insights in real-time</h2>
                    </div>
                    <div className="pill-tabs small">
                      <button
                        className={`pill ${assistantTab === 'summaries' ? 'selected' : ''}`}
                        onClick={() => setAssistantTab('summaries')}
                        type="button"
                      >
                        Summaries
                      </button>
                      <button
                        className={`pill ${assistantTab === 'chat' ? 'selected' : ''}`}
                        onClick={() => setAssistantTab('chat')}
                        type="button"
                      >
                        AI Chat
                      </button>
                    </div>
                  </header>

                  {assistantTab === 'summaries' ? (
                    <div className="summary-list">
                      {lectureSummaries.map((item) => (
                        <div className="summary-item" key={item.id}>
                          <div className="summary-meta">
                            <span className={`summary-type summary-${item.type.replace(' ', '').toLowerCase()}`}>
                              {item.type}
                            </span>
                            <span className="summary-time">{item.time}</span>
                          </div>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                          <button className="link-button" type="button">View details</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="chat-panel">
                      <div className="chat-log">
                        {lectureChat.map((entry) => (
                          <div className={`chat-bubble ${entry.role}`} key={entry.id}>
                            <div className="chat-meta">
                              <span className="chat-role">{entry.role === 'assistant' ? 'Assistant' : 'You'}</span>
                              <span className="chat-time">{entry.time}</span>
                            </div>
                            <p>{entry.message}</p>
                          </div>
                        ))}
                      </div>
                      <form className="chat-input" onSubmit={(event) => event.preventDefault()}>
                        <input placeholder="Ask the lecture assistant..." type="text" />
                        <button type="submit">Send</button>
                      </form>
                    </div>
                  )}
                </section>

                <section className="card status-card">
                  <header className="card-header compact">
                    <span className="chip chip-blue">Session Status</span>
                    <button className="icon-button" type="button">📤</button>
                  </header>
                  <div className="status-list">
                    <div className="status-item">
                      <span>Screen Capture</span>
                      <span className="status-indicator inactive">Inactive</span>
                    </div>
                    <div className="status-item">
                      <span>Audio Capture</span>
                      <span className="status-indicator inactive">Inactive</span>
                    </div>
                    <div className="status-item">
                      <span>Session Time</span>
                      <span className="status-time">00:00:00</span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </section>
        ) : (
          <section className="mode-section">
            <div className="mode-header">
              <div>
                <h1>Interview Intelligence</h1>
                <p className="mode-subtitle">Capture the shared screen, transcripts, and candidate context in one workspace.</p>
              </div>
              <div className="pill-tabs">
                <button
                  className={`pill ${interviewView === 'live' ? 'selected' : ''}`}
                  onClick={() => setInterviewView('live')}
                  type="button"
                >
                  Live Analysis
                </button>
                <button
                  className={`pill ${interviewView === 'documents' ? 'selected' : ''}`}
                  onClick={() => setInterviewView('documents')}
                  type="button"
                >
                  Documents
                </button>
              </div>
            </div>

            {interviewView === 'live' ? (
              <div className="content-grid interview-grid">
                <div className="primary-column">
                  <section className="card large-card">
                    <header className="card-header">
                      <div>
                        <span className="chip chip-blue">Screen Share</span>
                        <h2>Live interview feed</h2>
                        <p className="card-subtitle">Start capture to monitor whiteboard sessions or live coding.</p>
                      </div>
                      <button className="round-button" type="button">🪟</button>
                    </header>
                    <div className="card-body placeholder">
                      <span className="placeholder-icon">🧑‍💻</span>
                      <p>Screen stream will appear here once shared.</p>
                    </div>
                  </section>

                  <section className="card transcript-card">
                    <header className="card-header">
                      <div>
                        <span className="chip chip-purple">Transcript & AI Reply</span>
                        <h2>Conversation timeline</h2>
                      </div>
                      <button className="icon-button" type="button">⏱️</button>
                    </header>
                    <div className="transcript-list">
                      {interviewTranscript.map((row) => (
                        <article className="transcript-item" key={row.id}>
                          <div className="transcript-time">{row.time}</div>
                          <div className="transcript-content">
                            <div className="transcript-speaker">{row.speaker}</div>
                            <p>{row.message}</p>
                            {row.aiReply ? (
                              <div className="transcript-ai-reply">
                                <span className="chip chip-gold">AI Prompt</span>
                                <p>{row.aiReply}</p>
                              </div>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                </div>

                <aside className="secondary-column">
                  <section className="card documents-card">
                    <header className="card-header">
                      <div>
                        <span className="chip chip-green">Context Uploads</span>
                        <h2>Bring candidate materials</h2>
                        <p className="card-subtitle">Attach resumes, portfolios, or interview scorecards for tailored insights.</p>
                      </div>
                    </header>
                    <div className="upload-box">
                      <p>Drag & drop files here or</p>
                      <button className="outline-button" type="button">Browse files</button>
                      <span className="upload-hint">Supported: PDF, DOCX, TXT, ZIP</span>
                    </div>
                    <div className="document-list">
                      {interviewDocuments.map((doc) => (
                        <div className="document-item" key={doc.id}>
                          <div>
                            <div className="document-name">{doc.name}</div>
                            <div className="document-meta">{doc.category} · {doc.size} · {doc.updated}</div>
                          </div>
                          <span className={`status-indicator ${doc.status === 'Processed' ? 'active' : 'pending'}`}>{doc.status}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="card insights-card">
                    <header className="card-header compact">
                      <span className="chip chip-blue">Live Analysis</span>
                      <button className="icon-button" type="button">📝</button>
                    </header>
                    <div className="insights-list">
                      {interviewInsights.map((insight) => (
                        <div className={`insight-item ${insight.tone}`} key={insight.id}>
                          <h3>{insight.title}</h3>
                          <p>{insight.detail}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </aside>
              </div>
            ) : (
              <div className="card documents-tab">
                <header className="card-header">
                  <div>
                    <span className="chip chip-purple">Document Workspace</span>
                    <h2>Manage supporting materials</h2>
                    <p className="card-subtitle">Keep resumes, take-home projects, and interviewer notes organized for cross-reference.</p>
                  </div>
                  <button className="outline-button" type="button">Upload new</button>
                </header>
                <div className="documents-table">
                  {interviewDocuments.map((doc) => (
                    <div className="documents-row" key={doc.id}>
                      <div className="documents-col primary">
                        <span className="document-name">{doc.name}</span>
                        <span className="document-meta">{doc.category} · {doc.size}</span>
                      </div>
                      <div className="documents-col">
                        <span className={`status-indicator ${doc.status === 'Processed' ? 'active' : 'pending'}`}>{doc.status}</span>
                      </div>
                      <div className="documents-col">
                        <span className="document-meta">{doc.updated}</span>
                      </div>
                      <div className="documents-col actions">
                        <button className="icon-button" type="button">👁️</button>
                        <button className="icon-button" type="button">🗂️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
