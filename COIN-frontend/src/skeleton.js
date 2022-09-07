import {el, setChildren} from 'redom';
import './css/skeleton-account.scss';

export function createSkeletonBlock () {
  const skeletonBlock = el('div.post', [el('div.line.line__first'), el('div.line.line__second'), el('div.line')]);
  return skeletonBlock;
}

export function createSkeletonMap () {
  const skeletonBlock = el('div.card', el('p'));
  return skeletonBlock;
}

export function createSkeletonList () {
  const skeletonBlock = el('div.post', [el('div.line.line__first'), el('div.line.line__second'), el('div.line')]);
  return skeletonBlock;
}


export function skeletonAccountBlock (countBlok = 6) {
 const containerSkeleton = el('div.skeleton')
 const skeletonTitle = el('div.title-line', 'Ваши счета');
 const containerSkeletonList = el('div.container-skeleton');
 containerSkeleton.append(skeletonTitle, containerSkeletonList)
 for (let i = 0; i < countBlok; ++i) {
  containerSkeletonList.append(createSkeletonBlock());
 };
 
  return containerSkeleton;
}


export function skeletonForVeiwScore () {
  const containerSkeleton = el('div.skeleton')
  const skeletonTitle = el('div.title-line', 'Просмотр счета');
  const containerSkeletonList = el('div.container-skeleton');
  containerSkeleton.append(skeletonTitle, containerSkeletonList);
  for (let i = 0; i < 2; ++i) {
  const skeletonBlockSmall = el('div.post.post__view', [el('div.line.line__first'), el('div.line.line__second'), el('div.line')]);
   containerSkeletonList.append(skeletonBlockSmall);
  };
  const skeletonBlockBig = el('div.post.view-big-block',
   [el('div.line.line__long-line'), el('div.line.line__long-line'), el('div.line.line__long-line')]);
  containerSkeletonList.append(skeletonBlockBig);
  return containerSkeleton;
 }
