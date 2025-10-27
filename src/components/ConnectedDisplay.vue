<template>
   <div class="connected-display">
      <div class="hous-wrapper">
         <div class="house-body">
            <CorpSelector
               :corps="corps"
               :selectedCorp="selectedCorp"
               @selectCorp="selectCorp"
            />
            <FloorSelector
               :floors="floors"
               :selectedCorp="selectedCorp"
               :selectedFloor="selectedFloor"
               :showFloors="showFloors"
               @selectFloor="selectFloor"
            />
         </div>
         <DisplayPositioning />
      </div>
      <ApartmentSelector
         :selected-corp="selectedCorp"
         :selected-floor="selectedFloor"
         :selected-area-min="selectedAreaMin"
         :selected-rooms="selectedRooms"
         :selected-availability="selectedAvailability"
         @update:selectedCorp="selectCorp"
         @update:selectedFloor="selectFloor"
         @update:selectedAreaMin="selectedAreaMin = $event"
         @update:selectedRooms="(value) => (selectedRooms = value)"
         @update:selectedAvailability="
            (value) => (selectedAvailability = value)
         "
      />
      <BottomMenu />
   </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CorpSelector from "./CorpSelector.vue";
import FloorSelector from "./FloorSelector.vue";
import BottomMenu from "./BottomMenu.vue";
import DisplayPositioning from "./DisplayPositioning.vue";
import ApartmentSelector from "./ApartmentSelector.vue";

defineProps({
   lastMessage: {
      type: String,
      default: "",
   },
   receivedMessages: {
      type: Array,
      default: () => [],
   },
});

defineEmits(["disconnect", "sendData", "clearMessages"]);

const selectedCorp = ref(null);
const selectedFloor = ref(13);
const showFloors = ref(false);
const selectedAreaMin = ref(0);
const selectedRooms = ref([]);
const selectedAvailability = ref([]);

const corps = ref([
   { id: 1, name: "1", floorsCount: 22 },
   { id: 2, name: "2", floorsCount: 16 },
   { id: 3, name: "3", floorsCount: 16 },
   { id: 4, name: "4", floorsCount: 22 },
]);

const floors = computed(() => {
   const selectedCorpData = corps.value.find(
      (corp) => corp.id === selectedCorp.value
   );
   if (!selectedCorpData) return [];

   const floorsArray = [];
   for (let i = 2; i <= selectedCorpData.floorsCount; i++) {
      floorsArray.push({ id: i, num: i.toString() });
   }
   return floorsArray;
});

// Методы
const selectCorp = (corpId) => {
   selectedCorp.value = corpId;
   selectedFloor.value = null;
   showFloors.value = true;
};

const selectFloor = (floorId) => {
   selectedFloor.value = floorId;
};
</script>

<style scoped>
.connected-display {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   pointer-events: none;
}

.hous-wrapper {
   position: relative;
   width: 100%;
   height: 100%;
}

.house-body {
   width: 180px;
   position: absolute;
   top: 0;
   left: 0;
   z-index: 5;
   pointer-events: auto;
}
</style>
