import React from "react";
import { Skeleton } from '../components/Skeleton'; // adjust import path

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
};

export const TextSkeleton = () => <Skeleton.Text width={200} />;
export const CircleSkeleton = () => <Skeleton.Circle width={50} height={50} />;
export const RectangleSkeleton = () => <Skeleton.Rectangle width={300} height={100} />;
export const AvatarSkeleton = () => <Skeleton.Avatar width={60} height={60} />;
export const ImageSkeleton = () => <Skeleton.Image width={400} height={200} />;
export const CardSkeleton = () => <Skeleton.Card width={300} height={200} />;
export const ParagraphSkeleton = () => <Skeleton.Paragraph lines={4} />;
export const ProfileSkeleton = () => <Skeleton.Profile />;
export const TableSkeleton = () => <Skeleton.Table rows={5} columns={4} />;
export const ListSkeleton = () => <Skeleton.List items={5} />;
