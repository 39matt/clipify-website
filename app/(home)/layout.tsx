import { MarketingLayout } from 'components/home-page/layout'

export default function Layout(props: { children: React.ReactNode }) {
  return <MarketingLayout>{props.children}</MarketingLayout>
}
