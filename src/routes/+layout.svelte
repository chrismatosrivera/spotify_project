<script>
  import "../app.css";
</script>

<div class="p-3">
    <ul class="menu bg-base-200 lg:menu-horizontal rounded-box">
      <li>
        <a href="/tracks">
          Tracks
        </a>
      </li>
      <li>
        <a href="/artists">
          Artists
        </a>
      </li>
    </ul>

    <div class="p-3">
      <slot />
    </div>
</div>