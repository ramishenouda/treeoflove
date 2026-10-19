import { CmsImage } from '@/components/cms-image'
import { Blob, Sprig, TreeMark } from '@/components/decor'
import type { Media } from '@/payload-types'

const frame = 'absolute rounded-[1.75rem] bg-white p-2 shadow-lift'
const photo = 'w-full rounded-[1.35rem] object-cover'

export function PhotoCollage({ images }: { images: Media[] }) {
  const [first, second, third] = images

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
      <Blob className="absolute inset-[4%] text-sun-200/70" />
      <Sprig className="absolute -left-2 bottom-4 h-16 w-16 text-canopy-500/50" />
      {!first ? (
        <div className="absolute inset-[18%] flex items-center justify-center rounded-full bg-canopy-50">
          <TreeMark className="h-28 w-28" />
        </div>
      ) : null}
      {first && !second ? (
        <figure className={`${frame} left-[10%] top-[6%] w-[80%] -rotate-2`}>
          <CmsImage className={`${photo} aspect-[4/3]`} media={first} priority sizes="(min-width: 1024px) 36rem, 90vw" />
        </figure>
      ) : null}
      {first && second ? (
        <>
          <figure className={`${frame} left-[2%] top-[4%] w-[54%] -rotate-3`}>
            <CmsImage className={`${photo} aspect-[4/5]`} media={first} priority sizes="(min-width: 1024px) 20rem, 50vw" />
          </figure>
          <figure className={`${frame} right-[2%] top-[14%] w-[44%] rotate-3`}>
            <CmsImage className={`${photo} aspect-square`} media={second} sizes="(min-width: 1024px) 16rem, 45vw" />
          </figure>
        </>
      ) : null}
      {third ? (
        <figure className={`${frame} bottom-[2%] left-[34%] w-[44%] -rotate-1`}>
          <CmsImage className={`${photo} aspect-[4/3]`} media={third} sizes="(min-width: 1024px) 16rem, 45vw" />
        </figure>
      ) : null}
    </div>
  )
}
