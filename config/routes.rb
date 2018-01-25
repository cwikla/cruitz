
Rails.application.routes.draw do

  scope :api, defaults: { format: :json } do
    scope :v1 do
      get 'recruiters' => 'users#recruiters'
      get 'recruiters/:id' => 'users#recruiter'
      get 'candidates/:id/thread' => 'candidates#thread'

      resources :users, only: [:index, :create, :show, :update, :destroy]

        #resources :microposts, only: [:index, :create, :show, :update, :destroy]

      get 'jobs/:id(/:candidates)' => 'jobs#show'

      get 'settings' => 'settings#show'
      patch 'settings' => 'settings#update'

      post 'search(/:model)' => 'search#show'
      get 'search(/:model)' => 'search#show'


      resources :ratings
      resource :company
      resources :candidates
      resources :heads
      resources :jobs
      resources :invites, only: [:new, :create]
      resources :categories
      resource :me, { controller: "me" }
      patch 'password' => 'me#password'

      resources :uploads
      post 'uploads/make' => 'uploads#make', as: :api_v1_upload_url

      get 'locations' => 'locations#search'

      post 'messages/:id' => 'messages#create'

      resources :messages
      resources :skills

    end
  end

  get 'pricing' => 'home#pricing'
  get 'about' => 'home#about'
  get 'recruit' => 'home#recruiters'


  authenticated :user do
    root 'dashboard#index'
    #match "*path", to: redirect('/'), via: :all
  end


end
