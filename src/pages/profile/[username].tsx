import { NotFound, PostCard, Title } from 'components'
import Harper from 'db/harper/config'
import { GridLayout, PageLayout } from 'layouts'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import React, { Fragment } from 'react'
import { classnames } from 'tailwindcss-classnames'
import { Post } from 'types/Post'

const harper = new Harper()

const UserName = ({
  posts,
  results,
  message,
}: {
  posts: Array<Post>
  results: [] | null
  message: string
}) => {
  if (!results) return <NotFound message={message} title='404 Not Found' />

  return (
    <PageLayout>
      <Head>
        <title>{posts[0].name} | Bytes</title>
      </Head>

      <div className={classnames('py-3', 'my-10')}>
        <Title title={`Posts of ${posts[0].name}`} />
      </div>
      <GridLayout>
        {posts.map((post) => {
          const { name, username } = post
          return (
            <Fragment key={post.pid}>
              <PostCard post={post} author={{ name, username }} />
            </Fragment>
          )
        })}
      </GridLayout>
    </PageLayout>
  )
}

export default UserName

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { username } = query

  const posts = await harper.post({
    operation: 'sql',
    sql: `SELECT p.*,u.name,u.username FROM bytes.post AS p INNER JOIN bytes.user AS u ON u.uid=p.uid WHERE u.username='${username}'`,
  })

  if (!posts || !posts.length)
    return {
      props: {
        posts: [],
        results: null,
        message: 'No Posts or Invalid Username',
      },
    }
  else {
    return { props: { posts, results: posts.length, message: 'OK' } }
  }
}
