import { toJpeg } from 'html-to-image'
import QrCode from 'qrcode'
import React, { type FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const defaultFileName = 'QR Code Tour - '
const urlMaxLength = 50

export function Generator() {
  const [url, setUrl] = useState('')
  const [fileName, setFileName] = useState(defaultFileName)
  const [qrCode, setQrCode] = useState('')

  const qrCodeRef = React.useRef<HTMLDivElement>(null)
  const qrCodeToDownloadRef = React.useRef<HTMLDivElement>(null)

  const isUrlValid = url.startsWith('https://') && url.length <= urlMaxLength

  async function generateQrCode(event: FormEvent) {
    event.preventDefault()

    if (!isUrlValid) {
      return console.error('Invalid URL! It must starts with https://')
    }

    try {
      const qrData = await QrCode.toDataURL(url, {
        width: 2000,
        margin: 3,
      })

      if (!qrData) return console.error('Failed to generate QR code.')

      setQrCode(qrData)
      const downloadElement = qrCodeToDownloadRef.current

      if (downloadElement) {
        downloadElement.innerHTML = `<img src="${qrData}" alt="Generated QR Code" />`
        downloadQrCode()
      }
    } catch (error) {
      console.error('Failed to generate QR code.', error)
    }
  }

  async function downloadQrCode() {
    if (qrCodeToDownloadRef.current) {
      try {
        const image = await toJpeg(qrCodeToDownloadRef.current, {
          width: 2000,
          height: 2000,
        })

        const link = document.createElement('a')
        link.href = image
        link.download = `${fileName}.jpeg`
        link.click()
      } catch (error) {
        console.error('Failed to download QR code image', error)
      }
    }
  }

  return (
    <div className='flex min-h-svh items-center justify-center bg-background p-8'>
      <main className='w-full max-w-lg space-y-8'>
        <h1 className='text-center text-3xl font-bold text-primary'>
          QR Code generator
        </h1>
        <form onSubmit={generateQrCode} className='space-y-4'>
          <div className='flex w-full gap-4 max-sm:flex-col'>
            <fieldset className='w-full space-y-1'>
              <Label>URL</Label>
              <Input
                value={url}
                maxLength={urlMaxLength}
                onChange={e => setUrl(e.target.value)}
                placeholder='Paste your URL here...'
              />
            </fieldset>
            <fieldset className='w-full space-y-1'>
              <Label>File name</Label>
              <Input
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                placeholder='Insert the file name here...'
              />
            </fieldset>
          </div>
          <Button type='submit' className='w-full' disabled={!isUrlValid}>
            Generate and download QR code
          </Button>
        </form>

        <section className='space-y-4'>
          <div className='aspect-square size-full overflow-hidden rounded-xl border'>
            <div
              ref={qrCodeToDownloadRef}
              className={`fixed left-0 top-0 -z-10 size-[2000px]`}
            />
            <div
              ref={qrCodeRef}
              data-visible={!!qrCode}
              className='transition-opacity data-[visible=false]:opacity-0'
            >
              <img src={qrCode} alt='Generated QR Code' className='size-full' />
            </div>
          </div>
          <Button
            onClick={downloadQrCode}
            variant='outline'
            className='w-full'
            disabled={!qrCode}
          >
            Download QR code
          </Button>
        </section>
      </main>
    </div>
  )
}
