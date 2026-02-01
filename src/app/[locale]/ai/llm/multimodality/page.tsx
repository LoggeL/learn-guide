'use client'

import { TopicLayout } from '@/components/layout/TopicLayout'
import { MultimodalityVisualizer } from '@/components/interactive'
import { useTranslation } from '@/lib/i18n/context'
import { Image, Music, Video, Cpu, Zap, Brain, Layers } from 'lucide-react'

export default function MultimodalityPage() {
  const { t } = useTranslation()

  return (
    <TopicLayout
      title={t.multimodality.title}
      description={t.multimodality.description}
      breadcrumbs={[
        { label: t.categories.ai, href: '/' },
        { label: t.categories.llm, href: '/ai/llm' },
        { label: t.multimodality.title },
      ]}
      prevTopic={{ label: t.topicNames['agentic-vision'], href: '/ai/llm/agentic-vision' }}
      nextTopic={{ label: t.topicNames['llm-training'], href: '/ai/llm/training' }}
    >
      {/* Introduction */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.whatIs}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed text-lg">
            {t.multimodality.whatIsDesc}
          </p>
        </div>
      </section>

      {/* Modality Types */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.modalityTypes}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.multimodality.modalityTypesDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold font-heading text-blue-400">{t.multimodality.images}</h3>
            </div>
            <p className="text-sm text-muted">{t.multimodality.imagesDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold font-heading text-purple-400">{t.multimodality.audio}</h3>
            </div>
            <p className="text-sm text-muted">{t.multimodality.audioDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold font-heading text-emerald-400">{t.multimodality.video}</h3>
            </div>
            <p className="text-sm text-muted">{t.multimodality.videoDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-lg font-bold font-heading text-orange-400">{t.multimodality.other}</h3>
            </div>
            <p className="text-sm text-muted">{t.multimodality.otherDesc}</p>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-light" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading text-text">{t.multimodality.interactiveDemo}</h2>
            <p className="text-sm text-muted">{t.multimodality.interactiveDemoDesc}</p>
          </div>
        </div>
        <MultimodalityVisualizer
          labels={{
            selectModalities: t.multimodality.selectModalities,
            image: t.multimodality.images,
            audio: t.multimodality.audio,
            video: t.multimodality.video,
            text: t.multimodality.text,
            fusionResult: t.multimodality.fusionResult,
            selectToSee: t.multimodality.selectToSee,
            understanding: t.multimodality.understanding,
            imageDesc: t.multimodality.imageShort,
            audioDesc: t.multimodality.audioShort,
            videoDesc: t.multimodality.videoShort,
            textDesc: t.multimodality.textShort,
            combinedUnderstanding: t.multimodality.combinedUnderstanding,
            useCases: t.multimodality.useCases,
            examplePrompt: t.multimodality.examplePrompt,
            // Single modality use cases
            useCaseImageOnly: t.multimodality.useCaseImageOnly,
            useCaseImageOnlyDesc: t.multimodality.useCaseImageOnlyDesc,
            useCaseImageOnlyExample: t.multimodality.useCaseImageOnlyExample,
            useCaseAudioOnly: t.multimodality.useCaseAudioOnly,
            useCaseAudioOnlyDesc: t.multimodality.useCaseAudioOnlyDesc,
            useCaseAudioOnlyExample: t.multimodality.useCaseAudioOnlyExample,
            useCaseVideoOnly: t.multimodality.useCaseVideoOnly,
            useCaseVideoOnlyDesc: t.multimodality.useCaseVideoOnlyDesc,
            useCaseVideoOnlyExample: t.multimodality.useCaseVideoOnlyExample,
            useCaseTextOnly: t.multimodality.useCaseTextOnly,
            useCaseTextOnlyDesc: t.multimodality.useCaseTextOnlyDesc,
            useCaseTextOnlyExample: t.multimodality.useCaseTextOnlyExample,
            // Two modality combinations
            useCaseImageText: t.multimodality.useCaseImageText,
            useCaseImageTextDesc: t.multimodality.useCaseImageTextDesc,
            useCaseImageTextExample: t.multimodality.useCaseImageTextExample,
            useCaseAudioText: t.multimodality.useCaseAudioText,
            useCaseAudioTextDesc: t.multimodality.useCaseAudioTextDesc,
            useCaseAudioTextExample: t.multimodality.useCaseAudioTextExample,
            useCaseVideoText: t.multimodality.useCaseVideoText,
            useCaseVideoTextDesc: t.multimodality.useCaseVideoTextDesc,
            useCaseVideoTextExample: t.multimodality.useCaseVideoTextExample,
            useCaseImageAudio: t.multimodality.useCaseImageAudio,
            useCaseImageAudioDesc: t.multimodality.useCaseImageAudioDesc,
            useCaseImageAudioExample: t.multimodality.useCaseImageAudioExample,
            useCaseVideoAudio: t.multimodality.useCaseVideoAudio,
            useCaseVideoAudioDesc: t.multimodality.useCaseVideoAudioDesc,
            useCaseVideoAudioExample: t.multimodality.useCaseVideoAudioExample,
            useCaseImageVideo: t.multimodality.useCaseImageVideo,
            useCaseImageVideoDesc: t.multimodality.useCaseImageVideoDesc,
            useCaseImageVideoExample: t.multimodality.useCaseImageVideoExample,
            // Three modality combinations
            useCaseImageAudioText: t.multimodality.useCaseImageAudioText,
            useCaseImageAudioTextDesc: t.multimodality.useCaseImageAudioTextDesc,
            useCaseImageAudioTextExample: t.multimodality.useCaseImageAudioTextExample,
            useCaseVideoAudioText: t.multimodality.useCaseVideoAudioText,
            useCaseVideoAudioTextDesc: t.multimodality.useCaseVideoAudioTextDesc,
            useCaseVideoAudioTextExample: t.multimodality.useCaseVideoAudioTextExample,
            useCaseImageVideoText: t.multimodality.useCaseImageVideoText,
            useCaseImageVideoTextDesc: t.multimodality.useCaseImageVideoTextDesc,
            useCaseImageVideoTextExample: t.multimodality.useCaseImageVideoTextExample,
            useCaseImageAudioVideo: t.multimodality.useCaseImageAudioVideo,
            useCaseImageAudioVideoDesc: t.multimodality.useCaseImageAudioVideoDesc,
            useCaseImageAudioVideoExample: t.multimodality.useCaseImageAudioVideoExample,
            // All modalities
            useCaseAll: t.multimodality.useCaseAll,
            useCaseAllDesc: t.multimodality.useCaseAllDesc,
            useCaseAllExample: t.multimodality.useCaseAllExample,
          }}
        />
      </section>

      {/* How Multimodal Models Work */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.howWorks}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.multimodality.howWorksDesc}</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-5 bg-background rounded-xl border border-border">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
              <span className="text-cyan-400 font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-text mb-2">{t.multimodality.step1}</h3>
            <p className="text-sm text-muted">{t.multimodality.step1Desc}</p>
          </div>
          <div className="p-5 bg-background rounded-xl border border-border">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
              <span className="text-purple-400 font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-text mb-2">{t.multimodality.step2}</h3>
            <p className="text-sm text-muted">{t.multimodality.step2Desc}</p>
          </div>
          <div className="p-5 bg-background rounded-xl border border-border">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
              <span className="text-emerald-400 font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-text mb-2">{t.multimodality.step3}</h3>
            <p className="text-sm text-muted">{t.multimodality.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* Audio Processing */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.audioProcessing}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.multimodality.audioProcessingDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-purple-400 mb-2">{t.multimodality.speechRecognition}</h3>
            <p className="text-sm text-muted">{t.multimodality.speechRecognitionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-pink-400 mb-2">{t.multimodality.textToSpeech}</h3>
            <p className="text-sm text-muted">{t.multimodality.textToSpeechDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-violet-400 mb-2">{t.multimodality.musicUnderstanding}</h3>
            <p className="text-sm text-muted">{t.multimodality.musicUnderstandingDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-fuchsia-400 mb-2">{t.multimodality.audioGeneration}</h3>
            <p className="text-sm text-muted">{t.multimodality.audioGenerationDesc}</p>
          </div>
        </div>
      </section>

      {/* Video Understanding */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.videoUnderstanding}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.multimodality.videoUnderstandingDesc}</p>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-text mb-1">{t.multimodality.temporalReasoning}</h3>
              <p className="text-sm text-muted">{t.multimodality.temporalReasoningDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="font-bold text-text mb-1">{t.multimodality.frameSampling}</h3>
              <p className="text-sm text-muted">{t.multimodality.frameSamplingDesc}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-text mb-1">{t.multimodality.audioVideoSync}</h3>
              <p className="text-sm text-muted">{t.multimodality.audioVideoSyncDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Modal Fusion */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.crossModal}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.multimodality.crossModalDesc}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-cyan-400 mb-2">{t.multimodality.earlyFusion}</h3>
            <p className="text-sm text-muted">{t.multimodality.earlyFusionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-bold font-heading text-blue-400 mb-2">{t.multimodality.lateFusion}</h3>
            <p className="text-sm text-muted">{t.multimodality.lateFusionDesc}</p>
          </div>
          <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-xl md:col-span-2">
            <h3 className="text-lg font-bold font-heading text-indigo-400 mb-2">{t.multimodality.crossAttention}</h3>
            <p className="text-sm text-muted">{t.multimodality.crossAttentionDesc}</p>
          </div>
        </div>
      </section>

      {/* Real-World Applications */}
      <section className="rounded-2xl bg-surface/50 border border-border p-6 md:p-8">
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.applications}</h2>
        <p className="text-muted leading-relaxed mb-6">{t.multimodality.applicationsDesc}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-text mb-2">{t.multimodality.app1}</h3>
            <p className="text-sm text-muted">{t.multimodality.app1Desc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-text mb-2">{t.multimodality.app2}</h3>
            <p className="text-sm text-muted">{t.multimodality.app2Desc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-text mb-2">{t.multimodality.app3}</h3>
            <p className="text-sm text-muted">{t.multimodality.app3Desc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-text mb-2">{t.multimodality.app4}</h3>
            <p className="text-sm text-muted">{t.multimodality.app4Desc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-text mb-2">{t.multimodality.app5}</h3>
            <p className="text-sm text-muted">{t.multimodality.app5Desc}</p>
          </div>
          <div className="p-4 bg-background rounded-xl border border-border">
            <h3 className="font-bold text-text mb-2">{t.multimodality.app6}</h3>
            <p className="text-sm text-muted">{t.multimodality.app6Desc}</p>
          </div>
        </div>
      </section>

      {/* Key Takeaways */}
      <section>
        <h2 className="text-2xl font-bold font-heading text-gradient mb-6">{t.multimodality.keyTakeaways}</h2>
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
          <ul className="space-y-4 text-text">
            {[
              t.multimodality.takeaway1,
              t.multimodality.takeaway2,
              t.multimodality.takeaway3,
              t.multimodality.takeaway4,
              t.multimodality.takeaway5,
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary-light">{i + 1}</span>
                </span>
                <span className="text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </TopicLayout>
  )
}
