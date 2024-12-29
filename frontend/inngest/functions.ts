import {
  getFunctions,
  getRenderProgress,
  renderMediaOnLambda,
} from '@remotion/lambda/client'
import { inngest } from './client'

export const renderCloudVideo = inngest.createFunction(
  { id: 'render-video' },
  { event: 'render-video/short-video' },
  async ({ event, step }) => {
    const { audioFileUrl, captions, images } = event.data

    const renderVideo = await step.run(
      'Render Short Video Using Lambda',
      async () => {
        const functions = await getFunctions({
          region: 'us-east-1',
          compatibleOnly: true,
        })

        const functionName = functions[0].functionName

        const { renderId, bucketName } = await renderMediaOnLambda({
          region: 'us-east-1',
          functionName,
          serveUrl:
            'https://remotionlambda-useast1-gafocltvoz.s3.us-east-1.amazonaws.com/sites/ai-shorts-generator/index.html',
          composition: 'shortVideo',
          inputProps: {
            audioFileUrl: audioFileUrl,
            captions: captions,
            images: images,
          },
          codec: 'h264',
          maxRetries: 1,
          framesPerLambda: 100,
          privacy: 'public',
        })

        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const progress = await getRenderProgress({
            renderId,
            bucketName,
            functionName,
            region: 'us-east-1',
          })
          if (progress.done) {
            console.log('Render finished!', progress.outputFile)
            process.exit(0)
          }
          if (progress.fatalErrorEncountered) {
            console.error('Error enountered', progress.errors)
            process.exit(1)
          }
        }
      },
    )
  },
)
