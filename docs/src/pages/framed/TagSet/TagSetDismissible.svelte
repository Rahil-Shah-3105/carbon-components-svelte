<script>
  import { Tag, TagSet } from "carbon-components-svelte";

  let tags = [
    { label: "Angular", type: "red" },
    { label: "React", type: "blue" },
    { label: "Svelte", type: "purple" },
    { label: "Vue", type: "green" },
  ];

  function handleTagClose({ detail }) {
	console.debug(`>>> Entering handleTagClose(detail=${detail})`);
    tags = tags.filter((_, index) => index !== detail.index);
	console.debug(`handleTagClose(detail=${detail}): tags → ${tags}`);
  }
</script>

<TagSet on:close:tag={handleTagClose}>
  {#each tags as tag}
    <Tag type={tag.type} filter>{tag.label}</Tag>
  {/each}
</TagSet>
