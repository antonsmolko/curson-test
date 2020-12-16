<template>
    <nav aria-label="Page navigation">
        <ul class="pagination">
            <li
              class="page-item"
              :class="{ disabled: isFirst}">
                <a
                  class="page-link"
                  href="#"
                  aria-label="Previous"
                  @click.prevent="onPrev">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li
              class="page-item"
              v-for="item in items"
              :key="item"
              :class="{ active: isActive(item)}">
                <span v-if="isActive(item)" class="page-link">{{ item }}<span class="sr-only"></span></span>
                <a v-else class="page-link" href="#" @click.prevent="onPaginate(item)">{{ item }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: isLast }">
                <a
                  class="page-link"
                  href="#"
                  aria-label="Next"
                  @click.prevent="onNext">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
import range from 'lodash/range';
import take from 'lodash/take';
import takeRight from 'lodash/takeRight';

export default {
  name: "Pagination",
  props: {
    count: {
      type: Number,
      default: 1
    },
    active: {
      type: Number,
      default: 1
    }
  },
  computed: {
    items () {
      if (this.count <= 3) {
        return range(1, this.count + 1);
      }
      if (this.isFirst) {
        return take(range(1, this.count), 3);
      }
      if (this.isLast) {
        return takeRight(range(this.count - 2, this.count + 1), 3);
      }

      return range(this.active - 1, this.active + 2);
    },
    isFirst () {
      return this.active <= 1;
    },
    isLast () {
      return this.active >= this.count;
    }
  },
  methods: {
    onPaginate (value) {
      this.$emit('paginate', value);
    },
    isActive (item) {
      return item === this.active;
    },
    onPrev () {
      this.$emit('paginate', this.active - 1);
    },
    onNext () {
      this.$emit('paginate', this.active + 1);
    }
  }
}
</script>
