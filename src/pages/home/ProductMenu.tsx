import { Button, Dropdown } from '@heroui/react'
import { ChevronDown } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import lcmlIcon from '@/assets/lcml-icon.svg'

const products = [{ path: '/lcml', name: 'LCML', description: 'Minecraft 启动器', icon: lcmlIcon }]

// 鼠标离开后稍等再关，留出从按钮移到面板的时间。
const CLOSE_DELAY = 200
// 悬停打开后紧接着的一次点击不应把面板关掉。
const HOVER_GRACE = 400

export function ProductMenu() {
  const navigate = useNavigate()
  const [isOpen, setOpen] = useState(false)
  const closeTimer = useRef<number>(undefined)
  const hoverOpenedAt = useRef(0)

  const hoverIn = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    window.clearTimeout(closeTimer.current)
    if (!isOpen) hoverOpenedAt.current = Date.now()
    setOpen(true)
  }
  const hoverOut = (event: React.PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY)
  }
  const changeOpen = (open: boolean) => {
    if (!open && Date.now() - hoverOpenedAt.current < HOVER_GRACE) return
    setOpen(open)
  }

  return (
    <div onPointerEnter={hoverIn} onPointerLeave={hoverOut}>
      <Dropdown isOpen={isOpen} onOpenChange={changeOpen}>
        <Button size="lg">
          产品
          <ChevronDown
            className={`size-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
        <Dropdown.Popover placement="bottom" className="min-w-64">
          <div onPointerEnter={hoverIn} onPointerLeave={hoverOut}>
            <Dropdown.Menu aria-label="产品" onAction={(key) => navigate(String(key))}>
              {products.map((product) => (
                <Dropdown.Item key={product.path} id={product.path} textValue={product.name}>
                  <img src={product.icon} alt="" className="size-10 shrink-0 rounded-[22%]" />
                  <span className="flex flex-col text-left">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-xs text-muted">{product.description}</span>
                  </span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </div>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  )
}
