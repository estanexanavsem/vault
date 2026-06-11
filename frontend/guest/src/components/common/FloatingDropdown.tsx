import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  type Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { useCallback, useState, type ReactNode } from 'react'

interface FloatingDropdownProps {
  children: (close: () => void) => ReactNode
  floatingClassName: string
  label: string
  matchReferenceWidth?: boolean
  placement?: Placement
  triggerClassName: string
  triggerContent: (isOpen: boolean) => ReactNode
}

export function FloatingDropdown({
  children,
  floatingClassName,
  label,
  matchReferenceWidth = true,
  placement = 'bottom-start',
  triggerClassName,
  triggerContent,
}: FloatingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  const { context, floatingStyles, refs } = useFloating({
    middleware: [
      offset(0),
      flip(),
      shift({ padding: 16 }),
      ...(matchReferenceWidth
        ? [
            size({
              apply({ elements, rects }) {
                elements.floating.style.width = `${rects.reference.width}px`
              },
            }),
          ]
        : []),
    ],
    onOpenChange: setIsOpen,
    open: isOpen,
    placement,
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  })
  const role = useRole(context, { role: 'menu' })
  const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role])
  const setReferenceNode = useCallback(
    (node: HTMLButtonElement | null) => refs.setReference(node),
    [refs],
  )
  const setFloatingNode = useCallback(
    (node: HTMLDivElement | null) => refs.setFloating(node),
    [refs],
  )

  return (
    <>
      <button
        ref={setReferenceNode}
        {...getReferenceProps({
          'aria-label': label,
          className: triggerClassName,
          type: 'button',
        })}
      >
        {triggerContent(isOpen)}
      </button>

      {isOpen ? (
        <FloatingPortal>
          <div
            ref={setFloatingNode}
            style={floatingStyles}
            {...getFloatingProps({ className: floatingClassName })}
          >
            {children(close)}
          </div>
        </FloatingPortal>
      ) : null}
    </>
  )
}
