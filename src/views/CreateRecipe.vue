<template>
    <div class="create-recipe">
        <div class="container">
            <Navbar />
            <div class="row">
              <div class="col-sm-8">
                <h4 class="mt-5 mb-3">Recipe Name</h4>
                <div class="mb-3">
                    <input type="text" class="form-control" placeholder="Recipe Name" v-model="recipeName">
                </div>
              </div>
              <div class="col-sm-4">
                <h4 class="mt-5 mb-3">Type</h4>
                <form>
                  <select class="custom-select w-100" id="inputGroupSelect01">
                    <option value="1">Breakfast</option>
                    <option value="2">Lunch</option>
                    <option value="3">Dinner</option>
                    <option value="4">Desert</option>
                    <option value="5">Snack</option>
                    <option value="5">Drink</option>
                  </select>
                </form>
              </div>
            </div>


            <h4 class="mt-5 mb-3">Ingredients</h4>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Amount</span>
              </div>
              <input type="text" class="form-control col-1">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Measurement</span>
              </div>
              <select class="custom-select col-2" id="inputGroupSelect01">
                <option value="1">Cup</option>
                <option value="2">Tbsp</option>
                <option value="3">Tsp</option>
                <option value="4">oz</option>
                <option value="5">Whole</option>
                <option value="6">Half</option>
                <option value="7">Quarter</option>
                <option value="8">Pinch</option>
                <option value="9">Dash</option>
              </select>
              <input type="text" class="form-control" placeholder="Ingredient">
              <div class="input-group-append">
                <button class="btn btn-outline-danger" type="button">-</button>
              </div>
            </div>
            <div>
                <a href="#" class="btn btn-outline-success rounded-0">
                    Add Ingredient
                </a>
            </div>

            <h4 class="mt-5 mb-3">Instructions</h4>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Step</span>
              </div>
              <input type="number" min="1" class="form-control col-1" placeholder="#">
              <input type="text" class="form-control" placeholder="Instruction">
              <div class="input-group-append">
                <button class="btn btn-outline-danger" type="button">-</button>
              </div>
            </div>
            <div>
                <a href="#" class="btn btn-outline-success rounded-0">
                    Add Instruction
                </a>
            </div>

            <h4 class="mt-5 mb-3">Time</h4>
            <div class="row">
              <div class="col-sm-4">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Prep Time:</span>
                  </div>
                  <input type="number" min="1" class="form-control" placeholder="#">
                  <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon1">mins.</span>
                  </div>
                </div>
              </div>

              <div class="col-sm-4">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Cook Time:</span>
                  </div>
                  <input type="number" min="1" class="form-control" placeholder="#">
                  <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon1">mins.</span>
                  </div>
                </div>
              </div>

              <div class="col-sm-4">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Total Time:</span>
                  </div>
                  <input type="number" min="1" class="form-control" placeholder="#">
                  <div class="input-group-append">
                    <span class="input-group-text" id="basic-addon1">mins.</span>
                  </div>
                </div>
              </div>

            </div>



            <h4 class="mt-5 mb-3">Nutrition</h4>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Nutrition Key</span>
              </div>
              <input type="text" class="form-control" placeholder="(ex. Serving size)">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">Nutrition Value</span>
              </div>
              <input type="text" class="form-control" placeholder="(ex. 1/2 Cup)">
              <div class="input-group-append">
                <button class="btn btn-outline-danger" type="button">-</button>
              </div>
            </div>
            <div>
                <a href="#" class="btn btn-outline-success rounded-0">
                    Add Nutrition
                </a>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "create-recipe",
    components: {
        Navbar
    },
    data() {
        return {

        }
    }
};
</script>
